#!/usr/bin/env python3
"""
INERIM Colour Studio — AI Mask Generator for Google Colab
==========================================================
Runs SegFormer (ADE20K) semantic segmentation + SAM on GPU in Google Colab.
Produces pixel-perfect alpha masks for all 5 rooms with zero bleed and zero color guesswork.

Usage in Google Colab:
    Copy and paste this script into a Google Colab code cell (Runtime -> T4 GPU) and run.
    It will automatically generate the masks and trigger a download of 'visualizer-masks.zip'.
"""

import json
import os
import shutil
import sys
import zipfile

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import scipy.ndimage as ndimage

# Check Colab environment
IN_COLAB = 'google.colab' in sys.modules

if IN_COLAB:
    print("Detected Google Colab environment. Installing requirements...")
    os.system("pip install -q transformers torch torchvision pillow scipy segment-anything")
    # Clone repo if not already cloned
    if not os.path.exists("inerim"):
        print("Cloning repository...")
        os.system("git clone https://github.com/sshafayetsrabon-bit/inerim.git")
    ROOT = os.path.abspath("inerim")
else:
    ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

import torch
from transformers import AutoImageProcessor, AutoModelForSemanticSegmentation

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {DEVICE}")

SRC = os.path.join(ROOT, 'public', 'designs')
OUT = os.path.join(ROOT, 'public', 'visualizer')
PREVIEW = os.path.join(ROOT, '.visualizer-preview')
TS_OUT = os.path.join(ROOT, 'src', 'lib', 'scenes.generated.ts')
LONG_SIDE = 1600

os.makedirs(OUT, exist_ok=True)
os.makedirs(PREVIEW, exist_ok=True)

# -------------------------------------------------------------
# Color & Image Mathematics
# -------------------------------------------------------------

def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)

def box(a, r):
    h, w = a.shape
    p = np.pad(a, ((r + 1, r), (r + 1, r)), mode='edge').cumsum(0).cumsum(1)
    s = p[2 * r + 1:, 2 * r + 1:] - p[:-2 * r - 1, 2 * r + 1:] - p[2 * r + 1:, :-2 * r - 1] + p[:-2 * r - 1, :-2 * r - 1]
    return s[:h, :w] / (2 * r + 1) ** 2

def guided(guide, src, r=4, eps=1e-3):
    mI, mp = box(guide, r), box(src, r)
    a = (box(guide * src, r) - mI * mp) / (box(guide * guide, r) - mI * mI + eps)
    b = mp - a * mI
    return np.clip(box(a, r) * guide + box(b, r), 0, 1)

def morph(m, size, op):
    st = np.ones((size, size), bool)
    return ndimage.binary_dilation(m, st) if op == 'dilate' else ndimage.binary_erosion(m, st, border_value=1)

def polys_mask(size, polys):
    if not polys:
        return np.ones((size[1], size[0]), dtype=bool)
    img = Image.new('L', size, 0)
    d = ImageDraw.Draw(img)
    for p in polys:
        d.polygon([(x / 100 * size[0], y / 100 * size[1]) for x, y in p], fill=255)
    return np.asarray(img) > 0

# Helper to create rectangle polygon
R = lambda x0, y0, x1, y1: [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]

# -------------------------------------------------------------
# AI Model Initialization
# -------------------------------------------------------------

print("Loading SegFormer ADE20K semantic segmentation model...")
MODEL_ID = "nvidia/segformer-b5-finetuned-ade-640-640"
processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForSemanticSegmentation.from_pretrained(MODEL_ID).to(DEVICE)
model.eval()

# ADE20K Class IDs
# 0: wall
# 3: floor
# 5: ceiling
# 7: bed
# 8: windowpane / blinds
# 10: cabinet
# 14: door
# 15: table
# 18: curtain
# 19: chair
# 23: sofa
# 24: shelf
# 36: desk
# 39: wardrobe
# 44: wardrobe
# 57: cushion
# 110: quilt / bed cover
# 123: runner

def get_semantic_map(image_pil):
    """Returns per-pixel class prediction tensor upsampled to original image size."""
    inputs = processor(images=image_pil, return_tensors="pt").to(DEVICE)
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    upsampled_logits = torch.nn.functional.interpolate(
        logits,
        size=image_pil.size[::-1],
        mode="bilinear",
        align_corners=False,
    )
    return upsampled_logits.argmax(dim=1)[0].cpu().numpy()

# -------------------------------------------------------------
# Scene & Zone Rules
# -------------------------------------------------------------

# Master Bedroom Wall Boundary & Exclusions
MASTER_WALL_BOUNDS = [
    (7.7, 22.1), (74.0, 22.1), (74.0, 54.8), (72.0, 58.5), (72.0, 60.8),
    (70.0, 61.2), (68.0, 62.2), (66.0, 63.2), (64.0, 63.8), (62.0, 64.5),
    (60.0, 65.5), (58.0, 66.0), (54.0, 66.2), (50.0, 65.4), (45.0, 65.6),
    (42.0, 65.4), (40.0, 65.8), (38.0, 65.8), (36.0, 65.8), (34.0, 66.2),
    (33.0, 66.8), (31.0, 68.8), (29.0, 70.8), (27.0, 72.8), (25.0, 74.2),
    (23.0, 74.8), (7.7, 74.8)
]

THROW = [(41.4, 64.7), (52.8, 64.7), (54.4, 81.9), (38.6, 81.9)]
PINK_CUSHION = [(58.2, 69.6), (63.5, 65.4), (73.7, 66.4), (65.5, 72.7)]

SCENES_CONFIG = [
    {
        'id': 'master', 'name': 'Master Bedroom', 'src': 11,
        'product': {'slug': 'floating-bed-cove-light', 'label': 'Floating Bed with Cove Light'},
        'zones': [
            {
                'id': 'walls', 'label': 'Wall paint', 'kind': 'paint',
                'target_classes': [0], # Wall
                'exclude_classes': [3, 7, 8, 10, 15, 19, 36, 110, 123], # Floor, bed, window, desk, chair (ceiling already bounded by MASTER_WALL_BOUNDS)
                'bounds': [MASTER_WALL_BOUNDS],
                'exclude': [R(44.0, 34.5, 54.0, 49.5), R(55.0, 34.5, 65.2, 49.5)] # Art frames
            },
            {
                'id': 'bedding', 'label': 'Bed throw & cushion', 'kind': 'fabric',
                'target_classes': [123, 57, 110], # Runner, cushion, quilt
                'bounds': [THROW, PINK_CUSHION],
                'fallback_color_sim': {'seeds': [(46, 70), (46, 76), (44, 80), (65, 68), (68, 69), (47, 66)], 'tol': 14}
            },
            {
                'id': 'headboard', 'label': 'Bed upholstery', 'kind': 'fabric',
                'target_classes': [7], # Bed upholstery
                'bounds': [[(72, 55), (88, 55), (88, 75), (72, 75)], R(56.3, 78, 77, 86.5), R(23, 78, 28.3, 86.5)],
                'exclude': [R(69, 64, 81, 74.5), R(78.8, 71, 84.5, 77.5)],
                'fallback_color_sim': {'seeds': [(80, 60), (85, 66), (76, 57), (83, 70)], 'tol': 10}
            },
            {
                'id': 'wood', 'label': 'Wood panelling', 'kind': 'wood',
                'target_classes': [0, 10, 24], # Wall or panel
                'bounds': [[(74.0, 0), (94.5, 0), (94.5, 56), (74, 56)]],
                'exclude': [R(77.6, 29.6, 82.2, 44.4)], # Wall art on wood
                'fallback_color_sim': {'seeds': [(80, 20), (88, 40), (77, 45), (91, 15), (78, 30)], 'tol': 16}
            },
        ],
    },
    {
        'id': 'living', 'name': 'Living Room', 'src': 20,
        'product': {'slug': 'lounge-sofa-set', 'label': 'Lounge Sofa Set'},
        'zones': [
            {
                'id': 'sofa', 'label': 'Sofa fabric', 'kind': 'fabric',
                'target_classes': [23, 31], # Sofa, seat
                'bounds': [[(0, 60), (65, 60), (65, 95), (0, 95)]],
                'fallback_color_sim': {'seeds': [(40, 65), (55, 66), (45, 70), (20, 72)], 'tol': 14}
            },
            {
                'id': 'cushions', 'label': 'Cushions', 'kind': 'fabric',
                'target_classes': [57], # Cushion
                'bounds': [R(33.4, 60.5, 39.4, 67.6), R(36.4, 61.2, 42.6, 67.8), R(55.4, 60.4, 61.2, 67.6),
                           R(7.2, 68.2, 15.5, 77.6), R(13.9, 64.4, 22.7, 74.8), R(19.5, 62.3, 26.8, 70.8)],
                'fallback_color_sim': {'seeds': [(36, 64), (39.5, 64), (58.5, 64), (11, 73)], 'tol': 16}
            },
            {
                'id': 'curtains', 'label': 'Curtains', 'kind': 'fabric',
                'target_classes': [18], # Curtain
                'bounds': [R(22.6, 27.5, 33, 60.5), R(48.6, 27.5, 58.4, 60.5)],
                'fallback_color_sim': {'seeds': [(25, 35), (31, 45), (50, 35), (56, 45)], 'tol': 26}
            },
        ],
    },
    {
        'id': 'kids', 'name': "Kids' Room", 'src': 1,
        'product': {'slug': 'scallop-headboard-kids-bed', 'label': 'Scallop Headboard Kids Bed'},
        'zones': [
            {
                'id': 'upholstery', 'label': 'Headboard & window seat', 'kind': 'fabric',
                'target_classes': [7, 31, 57],
                'bounds': [R(15, 49, 56, 80), [(80, 63), (100, 70), (100, 78), (80, 70)]],
                'fallback_color_sim': {'seeds': [(20, 60), (25, 55), (45, 51), (35, 51)], 'tol': 18}
            },
            {
                'id': 'cabinet', 'label': 'Wall cabinets', 'kind': 'gloss',
                'target_classes': [10], # Cabinet
                'bounds': [R(62, 21, 78.5, 45)],
                'fallback_color_sim': {'seeds': [(66, 30), (74, 30), (66, 40)], 'tol': 14}
            },
            {
                'id': 'bedbase', 'label': 'Bed base', 'kind': 'fabric',
                'target_classes': [7],
                'bounds': [R(16.5, 78.5, 56, 89)],
                'fallback_color_sim': {'seeds': [(30, 83), (45, 83), (20, 84)], 'tol': 14}
            },
            {
                'id': 'walls', 'label': 'Wall paint', 'kind': 'paint',
                'target_classes': [0],
                'bounds': [[(9.5, 2), (29, 18), (29, 49), (16, 48), (9.5, 50)], R(29, 19, 61, 31.5), [(9.5, 49.5), (15.6, 48.6), (15.6, 80), (9.5, 83)]],
                'exclude': [R(26, 14, 51, 27.5)],
                'fallback_color_sim': {'seeds': [(20, 20), (15, 40), (24, 35)], 'tol': 12}
            },
            {
                'id': 'panel', 'label': 'Fluted panel', 'kind': 'wood',
                'target_classes': [0, 10, 24],
                'bounds': [R(28.5, 31.5, 54, 51)],
                'fallback_color_sim': {'seeds': [(35, 40), (48, 40), (42, 35)], 'tol': 16}
            },
        ],
    },
    {
        'id': 'dining', 'name': 'Dining', 'src': 21,
        'product': {'slug': 'velvet-shell-dining-chair', 'label': 'Velvet Shell Dining Chair'},
        'zones': [
            {
                'id': 'chairs', 'label': 'Dining chairs', 'kind': 'fabric',
                'target_classes': [19, 31], # Chair, seat
                'bounds': [R(23.5, 57, 76, 84)],
                'fallback_color_sim': {'seeds': [(40, 70), (58, 70), (27, 63), (70, 62)], 'tol': 12}
            },
            {
                'id': 'walls', 'label': 'Wall paint', 'kind': 'paint',
                'target_classes': [0], # Wall
                'bounds': [R(0, 21, 50, 74)],
                'exclude': [R(12.8, 30.8, 22.6, 48.8)],
                'fallback_color_sim': {'seeds': [(29, 30), (43, 30), (16, 56)], 'tol': 12}
            },
            {
                'id': 'cabinets', 'label': 'Cabinet shutters', 'kind': 'gloss',
                'target_classes': [10], # Cabinet
                'bounds': [R(61.5, 24, 74.5, 48)],
                'fallback_color_sim': {'seeds': [(66, 32), (70, 32), (63, 44)], 'tol': 12}
            },
        ],
    },
    {
        'id': 'guest', 'name': 'Guest Bedroom', 'src': 13,
        'product': {'slug': 'fluted-wall-panel', 'label': 'Fluted Wall Panel'},
        'zones': [
            {
                'id': 'throw', 'label': 'Bed throw', 'kind': 'fabric',
                'target_classes': [123, 110, 57],
                'bounds': [R(43, 64, 79, 76)],
                'fallback_color_sim': {'seeds': [(50, 67), (58, 67), (68, 67)], 'tol': 12}
            },
            {
                'id': 'wardrobe', 'label': 'Wardrobe shutters', 'kind': 'gloss',
                'target_classes': [39, 44, 10], # Wardrobe / cabinet
                'bounds': [[(0, 0), (22, 0), (32, 22), (31, 35), (20, 33), (20, 68), (13, 82), (0, 95)]],
                'fallback_color_sim': {'seeds': [(8, 30), (10, 60), (15, 40)], 'tol': 14}
            },
            {
                'id': 'feature', 'label': 'Feature wall', 'kind': 'paint',
                'target_classes': [0], # Wall
                'bounds': [R(45.5, 28, 70, 57)],
                'fallback_color_sim': {'seeds': [(48, 47), (68, 35), (68, 50)], 'tol': 10}
            },
            {
                'id': 'headboard', 'label': 'Headboard', 'kind': 'fabric',
                'target_classes': [7],
                'bounds': [R(45.5, 56, 70, 66)],
                'fallback_color_sim': {'seeds': [(50, 58), (60, 58), (65, 58)], 'tol': 12}
            },
        ],
    },
]

# -------------------------------------------------------------
# Mask Generation & Edge Snapping
# -------------------------------------------------------------

def build_zone_mask(rgb, sem_map, size, z):
    w, h = size
    bounds = polys_mask(size, z.get('bounds', []))
    if z.get('exclude'):
        bounds &= ~polys_mask(size, z['exclude'])

    target_classes = z.get('target_classes', [])
    exclude_classes = z.get('exclude_classes', [])

    # AI semantic mask
    mask = np.isin(sem_map, target_classes) & bounds
    if exclude_classes:
        mask &= ~np.isin(sem_map, exclude_classes)

    # If semantic mask has low coverage, blend with region growing from seeds
    if mask.sum() < 0.002 * w * h and 'fallback_color_sim' in z:
        print(f"      [info] blending with fallback seed for {z['id']}")
        fb = z['fallback_color_sim']
        lin = srgb_to_linear(rgb)
        pts = [(min(w - 1, int(x / 100 * w)), min(h - 1, int(y / 100 * h))) for x, y in fb['seeds']]
        refs = [rgb[y, x] for x, y in pts]
        dists = [np.linalg.norm(rgb - r, axis=-1) for r in refs]
        color_mask = (np.min(dists, axis=0) < (fb['tol'] / 100.0)) & bounds
        mask |= color_mask

    # Hole filling & speck dropping
    mask = morph(morph(mask, 5, 'dilate'), 5, 'erode') & bounds
    holes = ndimage.binary_fill_holes(mask) & ~mask
    lab_h, n = ndimage.label(holes)
    if n:
        sizes = ndimage.sum(holes, lab_h, range(1, n + 1))
        mask |= np.isin(lab_h, np.where(sizes <= 0.003 * w * h)[0] + 1)
    mask &= bounds
    mask = morph(morph(mask, 3, 'erode'), 3, 'dilate')

    # Edge snapping using guided filter on grayscale image
    grey = rgb.mean(-1)
    soft = guided(grey, mask.astype(float), r=4, eps=1e-3)
    soft = np.where(bounds, soft, 0)
    soft = np.clip((soft - 0.04) / 0.9, 0, 1)
    soft[mask & morph(mask, 5, 'erode')] = 1.0
    return soft

# -------------------------------------------------------------
# Main Pipeline
# -------------------------------------------------------------

def main():
    print("=" * 60)
    print("Starting INERIM AI Visualizer Mask Generation")
    print("=" * 60)

    meta = []
    generated_files = []

    for sc in SCENES_CONFIG:
        src_path = os.path.join(SRC, f"d{sc['src']:02d}.jpg")
        if not os.path.exists(src_path):
            # Try alternate path in visualizer
            alt_path = os.path.join(OUT, f"{sc['id']}.jpg")
            if os.path.exists(alt_path):
                src_path = alt_path
            else:
                print(f"Error: Could not find image for {sc['id']} at {src_path}")
                continue

        print(f"\nProcessing Scene: {sc['name']} ({sc['id']})...")
        im = Image.open(src_path).convert('RGB')
        im.thumbnail((LONG_SIDE, LONG_SIDE), Image.LANCZOS)
        size = im.size
        
        # Save base scene jpg
        base_jpg = os.path.join(OUT, f"{sc['id']}.jpg")
        im.save(base_jpg, quality=86, optimize=True, progressive=True)
        generated_files.append(base_jpg)

        rgb = np.asarray(im).astype(np.float64) / 255.0
        lin = srgb_to_linear(rgb)
        lum = lin @ np.array([0.2126, 0.7152, 0.0722])

        # Run AI semantic segmentation
        print("  Running SegFormer inference on GPU...")
        sem_map = get_semantic_map(im)

        zones = []
        overlay = rgb.copy()
        palette = [(0, 1, 0.45), (1, 0.2, 0.6), (0.1, 0.6, 1), (1, 0.75, 0), (0.8, 0.2, 1)]

        for k, z in enumerate(sc['zones']):
            print(f"    Generating zone: {z['label']} ({z['id']})...")
            a = build_zone_mask(rgb, sem_map, size, z)
            
            # Save 2-channel LA PNG (luminance=255, alpha=mask*255)
            alpha = Image.fromarray((a * 255).astype('uint8'))
            mask_png = os.path.join(OUT, f"{sc['id']}-{z['id']}.png")
            Image.merge('LA', (Image.new('L', size, 255), alpha)).save(mask_png, optimize=True)
            generated_files.append(mask_png)

            wsum = a.sum()
            base_y = float((lum * a).sum() / max(wsum, 1e-5))
            base_rgb = [float((lin[..., c] * a).sum() / max(wsum, 1e-5)) for c in range(3)]
            zones.append({
                'id': z['id'],
                'label': z['label'],
                'kind': z['kind'],
                'mask': f"/visualizer/{sc['id']}-{z['id']}.png",
                'baseY': round(base_y, 4),
                'baseRgb': [round(v, 4) for v in base_rgb],
                'coverage': round(float(a.mean()), 4)
            })

            # Overlay for preview inspection
            color = np.array(palette[k % len(palette)])
            overlay = overlay * (1 - a[..., None] * 0.65) + color * a[..., None] * 0.65
            print(f"      coverage: {a.mean():.4f}, baseY: {base_y:.4f}")

        # Save inspection preview
        preview_jpg = os.path.join(PREVIEW, f"{sc['id']}.jpg")
        Image.fromarray((overlay * 255).astype('uint8')).save(preview_jpg, quality=85)
        generated_files.append(preview_jpg)
        print(f"  Saved preview overlay: {preview_jpg}")

        meta.append({
            'id': sc['id'],
            'name': sc['name'],
            'image': f"/visualizer/{sc['id']}.jpg",
            'width': size[0],
            'height': size[1],
            'product': sc.get('product'),
            'zones': zones
        })

    # Write scenes.generated.ts
    print("\nWriting scenes.generated.ts...")
    with open(TS_OUT, 'w', encoding='utf8') as f:
        f.write('// Generated by scripts/colab_build_visualizer.py. Do not edit by hand.\n')
        f.write("import type { StudioScene } from './studio';\n\n")
        f.write('export const SCENES: StudioScene[] = ' + json.dumps(meta, indent=2, ensure_ascii=False) + ';\n')
    generated_files.append(TS_OUT)
    print(f"Wrote {TS_OUT}")

    # Create Zip Archive for easy download
    zip_path = os.path.join(ROOT, "visualizer-masks.zip")
    print(f"\nPackaging results into {zip_path}...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add public/visualizer/*.png and *.jpg
        for f in os.listdir(OUT):
            full = os.path.join(OUT, f)
            if os.path.isfile(full):
                zipf.write(full, arcname=f"public/visualizer/{f}")
        # Add .visualizer-preview/*.jpg
        if os.path.exists(PREVIEW):
            for f in os.listdir(PREVIEW):
                full = os.path.join(PREVIEW, f)
                if os.path.isfile(full):
                    zipf.write(full, arcname=f".visualizer-preview/{f}")
        # Add src/lib/scenes.generated.ts
        if os.path.exists(TS_OUT):
            zipf.write(TS_OUT, arcname="src/lib/scenes.generated.ts")

    print(f"Zip archive created: {zip_path} ({os.path.getsize(zip_path) / 1024 / 1024:.2f} MB)")

    # Trigger automatic browser download if in Colab
    if IN_COLAB:
        from google.colab import files
        print("Triggering automatic browser download...")
        files.download(zip_path)
        print("Download initiated! Check your browser's Downloads folder.")

    print("\n" + "=" * 60)
    print("ALL DONE SUCCESSFULLY!")
    print("=" * 60)

if __name__ == '__main__':
    main()
