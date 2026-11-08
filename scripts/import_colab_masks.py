#!/usr/bin/env python3
"""
Unpacks visualizer-masks.zip (from Google Colab) into the local project.
Looks in the current directory and in ~/Downloads/ for visualizer-masks.zip.
"""

import os
import sys
import zipfile
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANDIDATES = [
    os.path.join(ROOT, "visualizer-masks.zip"),
    os.path.expanduser("~/Downloads/visualizer-masks.zip"),
]

zip_path = None
for c in CANDIDATES:
    if os.path.exists(c):
        zip_path = c
        break

if not zip_path:
    print("Could not find visualizer-masks.zip!")
    print(f"Please put visualizer-masks.zip in {ROOT} or in ~/Downloads/")
    sys.exit(1)

print(f"Found archive: {zip_path}")
print("Extracting masks into project...")

with zipfile.ZipFile(zip_path, 'r') as zipf:
    for member in zipf.namelist():
        # Only extract into public/visualizer/, src/lib/scenes.generated.ts, and .visualizer-preview/
        if member.startswith("public/visualizer/") or member.startswith(".visualizer-preview/") or member == "src/lib/scenes.generated.ts":
            target = os.path.join(ROOT, member)
            os.makedirs(os.path.dirname(target), exist_ok=True)
            with zipf.open(member) as src, open(target, 'wb') as dst:
                shutil.copyfileobj(src, dst)
            print(f"  Extracted: {member}")

print("\nAll masks and scene metadata extracted successfully!")
