"""
Builds the Colour Studio scenes: resized renders + one soft mask per recolourable surface.

    python scripts/build_visualizer.py            # build everything
    python scripts/build_visualizer.py --preview  # also write green-overlay previews to ./.visualizer-preview

How a mask is made
  1. Colour similarity: pixels within `tol` (CIE Lab distance) of any seed's colour, inside the zone bounds.
  2. Region growing: only pixels connected to a seed survive (magic-wand), and strong image edges act as walls
     so the region can't leak into neighbouring furniture of a similar colour.
  3. Clean-up: close small gaps, drop specks, then a guided filter snaps the soft edge to the photo's real edges.

Seeds and bounds are in percent of image width/height. Outputs:
  public/visualizer/<scene>.jpg, public/visualizer/<scene>-<zone>.png, src/lib/scenes.generated.ts
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public', 'designs')
OUT = os.path.join(ROOT, 'public', 'visualizer')
TS_OUT = os.path.join(ROOT, 'src', 'lib', 'scenes.generated.ts')
PREVIEW = os.path.join(ROOT, '.visualizer-preview')
LONG_SIDE = 1600

# polygon helpers (percent coords)
R = lambda x0, y0, x1, y1: [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]

# exact outlines of the mauve throw and cushion in the master bedroom (same colour family as the wall)
THROW = [(41.4, 64.7), (52.8, 64.7), (54.4, 81.9), (38.6, 81.9)]
PINK_CUSHION = [(58.2, 69.6), (63.5, 65.4), (73.7, 66.4), (65.5, 72.7)]

# Precise polygon masks for master bedroom wall boundaries & exclusions
FAN_BLADE = [
    (35.6, 22.0), (39.3, 22.0), (39.8, 23.3), (38.8, 23.7), (38.0, 23.7), (36.6, 23.6), (35.6, 22.4)
]
MASTER_WALL_BOUNDS = [
    (7.7, 22.1),
    (74.0, 22.1),
    (74.0, 54.8),
    (72.5, 55.4),
    (72.0, 58.5),
    (72.0, 60.8),
    (70.0, 61.2),
    (68.0, 62.2),
    (66.0, 63.2),
    (64.0, 63.8),
    (62.0, 64.5),
    (60.0, 65.5),
    (58.0, 66.0),
    (54.0, 66.2),
    (50.0, 65.4),
    (45.0, 65.6),
    (42.0, 65.4),
    (40.0, 65.8),
    (38.0, 65.8),
    (36.0, 65.8),
    (34.0, 66.2),
    (33.0, 66.8),
    (31.0, 68.8),
    (29.0, 70.8),
    (27.0, 72.8),
    (25.0, 74.2),
    (23.0, 74.8),
    (7.7, 74.8)
]
MASTER_WALL_EXCLUDES = [
    FAN_BLADE,
    R(7.7, 35.8, 37.2, 59.5),                                                   # Window blinds
    [(7.6, 33.4), (26.8, 33.4), (26.8, 35.8), (7.6, 35.8)],                   # Top shelf wood board
    R(7.6, 29.3, 9.5, 33.4),                                                    # Left standing book on top shelf
    R(14.8, 32.0, 19.5, 33.4),                                                  # Middle flat books
    R(44.0, 34.5, 54.0, 49.5),                                                  # Left art frame
    R(55.0, 34.5, 65.2, 49.5),                                                  # Right art frame
    # Floating desk body, top, and right drawer face
    [(0.0, 58.8), (27.2, 58.8), (27.2, 62.1), (25.8, 63.2), (0.0, 63.2)],
    # Chair body
    [(5.8, 52.8), (17.2, 52.8), (17.2, 70.8), (5.8, 70.8)],
    # Chair legs
    [(4.8, 70.8), (6.0, 70.8), (6.0, 75.0), (4.8, 75.0)],                      # Front-left leg
    [(10.6, 70.8), (11.8, 70.8), (11.8, 75.0), (10.6, 75.0)],                 # Rear-left leg
    [(16.3, 70.8), (17.6, 70.8), (17.6, 75.0), (16.3, 75.0)],                 # Front-right leg
    [(19.4, 68.0), (20.5, 68.0), (20.5, 75.0), (19.4, 75.0)]                  # Rear-right leg
]

SCENES = [
    {
        'id': 'master', 'name': 'Master Bedroom', 'src': 11,
        'product': {'slug': 'floating-bed-cove-light', 'label': 'Floating Bed with Cove Light'},
        'zones': [
            {'id': 'walls', 'label': 'Wall paint', 'kind': 'paint', 'tol': 18.0, 'perSeed': True,
             'seeds': [
                 # Top soffit beam (left, center, right)
                 (10.0, 24.5), (16.0, 24.5), (21.0, 24.5),
                 (42.0, 24.5), (48.0, 24.5), (55.0, 24.5), (65.0, 24.5), (70.0, 24.5),
                 # Upper main wall
                 (42, 28), (50, 28), (62, 28), (70, 28),
                 (45, 38), (55, 38), (68, 38),
                 (65, 45), (72, 45), (73, 50),
                 # Open shelving compartments (top shelf)
                 (8.5, 27.0), (10.0, 27.0), (11.5, 27.0), (12.5, 31.5), 
                 (16.5, 27.0), (16.5, 30.5), (18.5, 27.0),
                 (21.0, 26.5), (25.5, 26.5), (26.0, 28.0), (30.0, 28.0), (35.0, 28.0),
                 # Corner above headboard next to wood paneling (golden LED cove gradient)
                 (68.0, 48.0), (70.0, 48.0), (72.0, 48.0),
                 (68.0, 51.0), (70.0, 51.0), (72.0, 51.0), (73.5, 51.0),
                 (68.0, 53.0), (70.0, 53.0), (72.0, 53.0), (73.5, 53.0),
                 (68.0, 54.2), (70.0, 54.2), (72.0, 54.2), (73.5, 54.2),
                 (71.5, 56.5), (71.5, 58.5), (72.0, 57.0), (72.0, 58.0),
                 # Wall above headboard & above pillows
                 (40.0, 53.5), (45.0, 53.5), (50.0, 53.5), (55.0, 53.5), (60.0, 53.5), (65.0, 53.5),
                 (40.0, 58.0), (45.0, 58.0), (50.0, 58.0), (55.0, 58.0), (60.0, 58.0), (65.0, 58.0),
                 (40.0, 62.0), (45.0, 62.0), (50.0, 62.0), (55.0, 62.0), (60.0, 62.0),
                 (40.0, 63.5), (45.0, 63.5), (50.0, 63.5), (55.0, 63.5), (58.0, 63.5),
                 (40.0, 64.8), (45.0, 64.8), (50.0, 64.8), (54.0, 65.5), (58.0, 65.2), (60.0, 64.8),
                 # Wall strip between desk and bed
                 (28.0, 61.5), (30.0, 61.5), (32.0, 61.5), (34.0, 61.8), (36.0, 62.0),
                 (28.0, 64.0), (30.0, 64.0), (32.0, 64.0), (34.0, 64.0),
                 (28.0, 66.0), (29.0, 66.0), (30.0, 65.5),
                 (25.0, 68.0), (26.0, 68.0), (27.0, 68.0),
                 (24.0, 71.0), (25.0, 71.0),
                 (23.0, 73.5),
                 (38.0, 56.0), (38.0, 59.0), (38.0, 62.0),
                 # Under desk wall
                 (10.0, 64.5), (15.0, 64.5), (20.0, 64.5), (23.5, 64.5),
                 (20.0, 67.0), (23.5, 67.0),
                 (23.5, 70.0), (23.5, 73.0),
                 # Between legs
                 (14.0, 72.5), (15.5, 72.5), (18.5, 72.5),
                 # Left of chair front-left leg
                 (8.0, 72.5)
             ],
             'bounds': [MASTER_WALL_BOUNDS],
             'exclude': MASTER_WALL_EXCLUDES},
            {'id': 'bedding', 'label': 'Bed throw & cushion', 'kind': 'fabric', 'tol': 14,
             'seeds': [(46, 70), (46, 76), (44, 80), (65, 68), (68, 69), (47, 66)],
             'bounds': [THROW, PINK_CUSHION]},
            {'id': 'headboard', 'label': 'Bed upholstery', 'kind': 'fabric', 'tol': 9,
             'seeds': [(80, 60), (85, 66), (76, 57), (83, 70), (65, 82), (70, 83), (60, 81), (26, 82)],
             'bounds': [[(72, 55), (88, 55), (88, 75), (72, 75)], R(56.3, 78, 77, 86.5), R(23, 78, 28.3, 86.5)],
             'exclude': [R(69, 64, 81, 74.5), R(78.8, 71, 84.5, 77.5)]},
            {'id': 'wood', 'label': 'Wood panelling', 'kind': 'wood', 'tol': 16, 'edge': 0.14,
             'seeds': [(80, 20), (88, 40), (77, 45), (91, 15), (78, 30), (92, 50), (76, 10)],
             'bounds': [[(80.5, 0), (94.5, 0), (94.5, 56), (74, 56), (74, 20.5)]],
             'exclude': [R(77.6, 29.6, 82.2, 44.4)]},
        ],
    },
    {
        'id': 'living', 'name': 'Living Room', 'src': 20,
        'product': {'slug': 'lounge-sofa-set', 'label': 'Lounge Sofa Set'},
        'zones': [
            {'id': 'sofa', 'label': 'Sofa fabric', 'kind': 'fabric', 'tol': 12,
             'seeds': [(40, 65), (55, 66), (45, 70), (57, 70), (10, 75), (20, 72), (25, 80), (6, 86), (15, 86), (36, 62), (49, 63), (27, 74), (8, 70),
                       (46, 61.5), (32, 68), (61, 68), (3, 80), (12, 80)],
             'bounds': [[(0, 67.5), (10, 65), (20, 62.7), (23, 62.3), (31.2, 65.7), (31.2, 74.6), (17.5, 90.5), (0, 92.5)],
                        [(30.7, 63.4), (34, 60), (59.5, 60), (62.3, 63.5), (62.3, 73.4), (30.7, 73.4)]]},
            {'id': 'cushions', 'label': 'Cushions', 'kind': 'fabric', 'tol': 16, 'perSeed': True,
             'seeds': [(36, 64), (39.5, 64), (58.5, 64), (11, 73), (18, 69), (23, 66.5), (37, 66), (40, 66), (59, 66), (13, 75)],
             'bounds': [R(33.4, 60.5, 39.4, 67.6), R(36.4, 61.2, 42.6, 67.8), R(55.4, 60.4, 61.2, 67.6),
                        R(7.2, 68.2, 15.5, 77.6), R(13.9, 64.4, 22.7, 74.8), R(19.5, 62.3, 26.8, 70.8)]},
            {'id': 'curtains', 'label': 'Curtains', 'kind': 'fabric', 'tol': 30, 'edgeW': 0,
             'seeds': [(25, 35), (31, 45), (28, 57), (50, 35), (56, 45), (53, 55), (24, 45), (57, 30), (27, 30), (52, 30)],
             'bounds': [R(22.6, 27.5, 33, 60.5), R(48.6, 27.5, 58.4, 60.5)],
             'exclude': [R(22, 48, 30.5, 53.5)]},
        ],
    },
    {
        'id': 'kids', 'name': "Kids' Room", 'src': 1,
        'product': {'slug': 'scallop-headboard-kids-bed', 'label': 'Scallop Headboard Kids Bed'},
        'zones': [
            {'id': 'upholstery', 'label': 'Headboard & window seat', 'kind': 'fabric', 'tol': 21, 'edge': 0.3,
             'seeds': [(20, 60), (25, 55), (45, 51), (35, 51), (17, 70), (22, 75), (50, 51), (53, 57), (31, 51), (35, 53), (45, 53), (40, 52),
                       (17, 78), (88, 70), (84, 66), (95, 74)],
             'bounds': [R(15, 49, 56, 80), [(80, 63), (100, 70), (100, 78), (80, 70)]],
             'exclude': [[(23, 60.3), (55, 60.3), (55, 79.5), (18.8, 79.5), (19.3, 73), (21, 66)]]},
            {'id': 'cabinet', 'label': 'Wall cabinets', 'kind': 'gloss', 'tol': 14, 'edge': 0.12,
             'seeds': [(66, 30), (74, 30), (66, 40), (74, 40), (66, 24), (74, 24), (70, 35)],
             'bounds': [R(62, 21, 78.5, 45)]},
            {'id': 'bedbase', 'label': 'Bed base', 'kind': 'fabric', 'tol': 14, 'edge': 0.1,
             'seeds': [(30, 83), (45, 83), (20, 84), (38, 86), (52, 82)],
             'bounds': [R(16.5, 78.5, 56, 89)]},
            {'id': 'walls', 'label': 'Wall paint', 'kind': 'paint', 'tol': 7, 'edge': 0.07,
             'seeds': [(20, 20), (15, 40), (24, 35), (12, 10), (40, 25), (55, 25), (22, 46), (17, 28), (26, 12), (12, 60), (12, 72), (13, 52), (57, 29), (32, 29)],
             'bounds': [[(9.5, 2), (29, 18), (29, 49), (16, 48), (9.5, 50)], R(29, 19, 61, 31.5), [(9.5, 49.5), (15.6, 48.6), (15.6, 80), (9.5, 83)]],
             'exclude': [R(26, 14, 51, 27.5)]},
            {'id': 'panel', 'label': 'Fluted panel', 'kind': 'wood', 'tol': 16, 'edge': 0.18,
             'seeds': [(35, 40), (48, 40), (42, 35), (32, 45), (51, 46), (40, 47)],
             'bounds': [R(28.5, 31.5, 54, 51)]},
        ],
    },
    {
        'id': 'dining', 'name': 'Dining', 'src': 21,
        'product': {'slug': 'velvet-shell-dining-chair', 'label': 'Velvet Shell Dining Chair'},
        'zones': [
            {'id': 'chairs', 'label': 'Dining chairs', 'kind': 'fabric', 'tol': 10, 'holes': 0.0002, 'lw': 0.9,
             'seeds': [(40, 70), (58, 70), (27, 63), (70, 62), (38, 76), (60, 76), (28, 67), (72, 66), (29, 70), (69, 70), (26, 65), (71, 64)],
             'bounds': [R(23.5, 57, 76, 84)],
             'exclude': [R(24, 75.5, 33.3, 85), R(66, 75.5, 74, 85), R(73.5, 63, 76.5, 68), R(49.5, 56.8, 74.5, 61.5)]},
            {'id': 'walls', 'label': 'Wall paint', 'kind': 'paint', 'tol': 9, 'edge': 0.07,
             'seeds': [(29, 30), (43, 30), (16, 56), (19, 28), (17, 65), (12, 24), (30, 25), (47, 27)],
             'bounds': [R(0, 21, 50, 74)],
             'exclude': [R(12.8, 30.8, 22.6, 48.8)]},
            {'id': 'cabinets', 'label': 'Cabinet shutters', 'kind': 'gloss', 'tol': 9, 'edge': 0.08,
             'seeds': [(66, 32), (70, 32), (63, 44), (72, 44), (65, 38), (71, 26)],
             'bounds': [R(61.5, 24, 74.5, 48)]},
        ],
    },
    {
        'id': 'guest', 'name': 'Guest Bedroom', 'src': 13,
        'product': {'slug': 'fluted-wall-panel', 'label': 'Fluted Wall Panel'},
        'zones': [
            {'id': 'throw', 'label': 'Bed throw', 'kind': 'fabric', 'tol': 10,
             'seeds': [(50, 67), (58, 67), (68, 67), (64, 66.5), (54, 67)],
             'bounds': [R(43, 64, 79, 76)],
             'exclude': [[(70.3, 65.3), (77.5, 64.3), (80, 74), (71, 77)]]},
            {'id': 'wardrobe', 'label': 'Wardrobe shutters', 'kind': 'gloss', 'tol': 14, 'edge': 0.12,
             'seeds': [(8, 30), (10, 60), (15, 40), (25, 20), (5, 80), (3, 15), (17, 70), (12, 50), (22, 12), (28, 28)],
             'bounds': [[(0, 0), (22, 0), (32, 22), (31, 35), (20, 33), (20, 68), (13, 82), (0, 95)]]},
            {'id': 'feature', 'label': 'Feature wall', 'kind': 'paint', 'tol': 8, 'edge': 0.06,
             'seeds': [(48, 47), (68, 35), (68, 50), (66, 30), (50, 30), (52, 52)],
             'bounds': [R(45.5, 28, 70, 57)]},
            {'id': 'headboard', 'label': 'Headboard', 'kind': 'fabric', 'tol': 12, 'edge': 0.1,
             'seeds': [(50, 58), (60, 58), (65, 58), (47, 62), (68, 61)],
             'bounds': [R(45.5, 56, 70, 66)]},
        ],
    },
]


# ---------------------------------------------------------------- colour maths

def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_lab(rgb):
    lin = srgb_to_linear(rgb)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = lin @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def box(a, r):
    """Mean filter with an integral image (window 2r+1)."""
    h, w = a.shape
    p = np.pad(a, ((r + 1, r), (r + 1, r)), mode='edge').cumsum(0).cumsum(1)
    s = p[2 * r + 1:, 2 * r + 1:] - p[:-2 * r - 1, 2 * r + 1:] - p[2 * r + 1:, :-2 * r - 1] + p[:-2 * r - 1, :-2 * r - 1]
    return s[:h, :w] / (2 * r + 1) ** 2


def guided(guide, src, r=6, eps=2e-3):
    mI, mp = box(guide, r), box(src, r)
    a = (box(guide * src, r) - mI * mp) / (box(guide * guide, r) - mI * mI + eps)
    b = mp - a * mI
    return np.clip(box(a, r) * guide + box(b, r), 0, 1)


def grow(seeds_mask, allowed):
    """Keep only the connected parts of `allowed` that touch a seed."""
    from scipy import ndimage
    labels, _ = ndimage.label(allowed)
    keep = np.unique(labels[seeds_mask & allowed])
    return np.isin(labels, keep[keep > 0])


def morph(m, size, op):
    from scipy import ndimage
    st = np.ones((size, size), bool)
    return ndimage.binary_dilation(m, st) if op == 'dilate' else ndimage.binary_erosion(m, st, border_value=1)


def polys_mask(size, polys):
    img = Image.new('L', size, 0)
    d = ImageDraw.Draw(img)
    for p in polys:
        d.polygon([(x / 100 * size[0], y / 100 * size[1]) for x, y in p], fill=255)
    return np.asarray(img) > 0


# ---------------------------------------------------------------- build

LIGHTNESS_WEIGHT = 0.35  # shading changes brightness, not hue: weigh lightness far less than colour
EDGE = 4.0  # weighted-Lab gradient (per pixel) that counts as an object boundary


def build_zone(rgb, labw, edges, size, z):
    from scipy import ndimage
    w, h = size
    bounds = polys_mask(size, z['bounds'])
    if z.get('exclude'):
        bounds &= ~polys_mask(size, z['exclude'])
    pts = [(min(w - 1, int(x / 100 * w)), min(h - 1, int(y / 100 * h))) for x, y in z['seeds']]
    edge = z.get('edgeW', EDGE)
    wall = edges > edge if edge else np.zeros((h, w), bool)

    if z.get('lw'):
        labw = labw * np.array([z['lw'] / LIGHTNESS_WEIGHT, 1.0, 1.0])

    def region_for(seed_pts):
        refs = [labw[max(0, y - 3):y + 4, max(0, x - 3):x + 4].reshape(-1, 3).mean(0) for x, y in seed_pts]
        dist = np.min([np.linalg.norm(labw - r, axis=-1) for r in refs], axis=0)
        allowed = (dist < z['tol']) & bounds & ~wall
        seeds = np.zeros((h, w), bool)
        for x, y in seed_pts:
            seeds[max(0, y - 2):y + 3, max(0, x - 2):x + 3] = True
        return grow(seeds, allowed)

    if not z.get('perSeed'):
        # drop seeds that landed on a different object: they'd drag their own colour into the surface
        cols = np.array([labw[y, x] for x, y in pts])
        med = np.median(cols, 0)
        keep = [p for p, c in zip(pts, cols) if np.linalg.norm(c - med) <= z['tol'] * 1.3]
        if len(keep) < len(pts):
            print(f"    {z['id']}: ignored {len(pts) - len(keep)} off-surface seed(s)")
        pts = keep

    region = np.zeros((h, w), bool)
    for group in ([[p] for p in pts] if z.get('perSeed') else [pts]):
        region |= region_for(group)

    # reclaim boundary pixels, then fill enclosed holes (reflections, texture, light spots) up to a size limit
    region = morph(morph(region, 7, 'dilate'), 7, 'erode') & bounds
    holes = ndimage.binary_fill_holes(region) & ~region
    lab_h, n = ndimage.label(holes)
    if n:
        sizes = ndimage.sum(holes, lab_h, range(1, n + 1))
        region |= np.isin(lab_h, np.where(sizes <= z.get('holes', 0.004 if z['kind'] == 'paint' else 0.0005) * w * h)[0] + 1)
    region &= bounds
    region = morph(morph(region, 3, 'erode'), 3, 'dilate')  # drop specks
    grey = rgb.mean(-1)
    soft = guided(grey, region.astype(float), r=4, eps=1e-3)
    soft = np.where(bounds, soft, 0)
    soft = np.clip((soft - 0.04) / 0.9, 0, 1)
    soft[region & morph(region, 5, 'erode')] = 1.0  # solid interior: no faint patches
    return soft


def main(preview=False):
    os.makedirs(OUT, exist_ok=True)
    if preview:
        os.makedirs(PREVIEW, exist_ok=True)
    meta = []
    for sc in SCENES:
        if ONLY and sc['id'] not in ONLY:
            meta.append(PREV.get(sc['id']))
            continue
        im = Image.open(os.path.join(SRC, f"d{sc['src']:02d}.jpg")).convert('RGB')
        im.thumbnail((LONG_SIDE, LONG_SIDE), Image.LANCZOS)
        im.save(os.path.join(OUT, f"{sc['id']}.jpg"), quality=86, optimize=True, progressive=True)
        size = im.size
        rgb = np.asarray(im).astype(np.float64) / 255
        blur = np.asarray(im.filter(ImageFilter.GaussianBlur(1.6))).astype(np.float64) / 255
        labw = to_lab(blur) * np.array([LIGHTNESS_WEIGHT, 1.0, 1.0])
        gx = np.linalg.norm(np.diff(labw, axis=1, append=labw[:, -1:]), axis=-1)
        gy = np.linalg.norm(np.diff(labw, axis=0, append=labw[-1:, :]), axis=-1)
        edges = np.maximum(gx, gy)
        lin = srgb_to_linear(rgb)
        lum = lin @ np.array([0.2126, 0.7152, 0.0722])
        zones = []
        overlay = rgb.copy()
        palette = [(0, 1, 0.45), (1, 0.2, 0.6), (0.1, 0.6, 1), (1, 0.75, 0)]
        for k, z in enumerate(sc['zones']):
            a = build_zone(rgb, labw, edges, size, z)
            alpha = Image.fromarray((a * 255).astype('uint8'))
            Image.merge('LA', (Image.new('L', size, 255), alpha)).save(os.path.join(OUT, f"{sc['id']}-{z['id']}.png"), optimize=True)
            wsum = a.sum()
            base_y = float((lum * a).sum() / wsum)
            base_rgb = [float((lin[..., c] * a).sum() / wsum) for c in range(3)]
            zones.append({'id': z['id'], 'label': z['label'], 'kind': z['kind'], 'mask': f"/visualizer/{sc['id']}-{z['id']}.png",
                          'baseY': round(base_y, 4), 'baseRgb': [round(v, 4) for v in base_rgb], 'coverage': round(float(a.mean()), 4)})
            overlay = overlay * (1 - a[..., None] * 0.65) + np.array(palette[k % 4]) * a[..., None] * 0.65
            print(f"  {sc['id']}/{z['id']}: coverage {a.mean():.3f}, baseY {base_y:.3f}")
        if preview:
            Image.fromarray((overlay * 255).astype('uint8')).save(os.path.join(PREVIEW, f"{sc['id']}.jpg"), quality=82)
        meta.append({'id': sc['id'], 'name': sc['name'], 'image': f"/visualizer/{sc['id']}.jpg", 'width': size[0], 'height': size[1],
                     'product': sc.get('product'), 'zones': zones})
    with open(TS_OUT, 'w', encoding='utf8') as f:
        f.write('// Generated by scripts/build_visualizer.py. Do not edit by hand.\n')
        f.write("import type { StudioScene } from './studio';\n\n")
        f.write('export const SCENES: StudioScene[] = ' + json.dumps(meta, indent=2, ensure_ascii=False) + ';\n')
    print('wrote', TS_OUT)


ONLY = [a for a in sys.argv[1:] if not a.startswith('--')]
PREV = {}
if ONLY and os.path.exists(TS_OUT):  # keep metadata of scenes we are not rebuilding
    _src = open(TS_OUT, encoding='utf8').read()
    PREV = {s['id']: s for s in json.loads(_src[_src.index('= [') + 2:_src.rindex(']') + 1])}

if __name__ == '__main__':
    main(preview='--preview' in sys.argv)
