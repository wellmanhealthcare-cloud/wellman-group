# -*- coding: utf-8 -*-
"""Upload local OT images to Cloudinary and patch matching service products."""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os
import requests

BASE   = "http://localhost:8000/v1"
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "../../../images")

# ── Login ──────────────────────────────────────────────────────────────────────
r = requests.post(f"{BASE}/auth/login", json={
    "email": "admin@wellmangroup.in",
    "password": "Kar@2005",
})
if r.status_code != 200:
    print("Login failed:", r.text); sys.exit(1)
token   = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in.\n")

# ── Which image → which product name ──────────────────────────────────────────
# All 7 images are Modular OT photos; map each filename to the most fitting product.
IMAGE_TO_PRODUCT = {
    "WhatsApp Image 2026-05-30 at 13.57.30 (1).jpeg": "LED OT Lights (Shadowless)",
    "WhatsApp Image 2026-05-30 at 13.57.30 (2).jpeg": "HEPA Filter Ceiling Units (LAF Modules)",
    "WhatsApp Image 2026-05-30 at 13.57.30.jpeg":     "Surgical Pendant (Ceiling-Mounted)",
    "WhatsApp Image 2026-05-30 at 13.57.31 (1).jpeg": "Modular Wall Panels (EPS / PUF Core)",
    "WhatsApp Image 2026-05-30 at 13.57.31 (2).jpeg": "Walkable Ceiling Panels",
    "WhatsApp Image 2026-05-30 at 13.57.31.jpeg":     "Anti-static Vinyl Flooring (Welded)",
    "WhatsApp Image 2026-05-30 at 13.57.32.jpeg":     "Hermetic Sliding Doors",
}

# ── Fetch existing MOT products ────────────────────────────────────────────────
r = requests.get(
    f"{BASE}/admin/service-products",
    params={"service_slug": "modular-operation-theatre"},
    headers=headers,
)
if r.status_code != 200:
    print("Failed to fetch products:", r.text); sys.exit(1)

products = {p["name"]: p for p in r.json()}
print(f"Found {len(products)} MOT products in DB.\n")

# ── Upload each image then PATCH the matching product ─────────────────────────
for filename, product_name in IMAGE_TO_PRODUCT.items():
    filepath = os.path.join(IMAGES_DIR, filename)
    if not os.path.exists(filepath):
        print(f"  MISSING  {filename}")
        continue

    print(f"Uploading  '{filename}'")
    with open(filepath, "rb") as f:
        upload_r = requests.post(
            f"{BASE}/admin/upload/image",
            headers=headers,
            files={"file": (filename, f, "image/jpeg")},
        )

    if upload_r.status_code not in (200, 201):
        print(f"  UPLOAD FAILED  {upload_r.status_code}: {upload_r.text}\n")
        continue

    url = upload_r.json()["url"]
    print(f"  → {url}")

    # Find product
    product = products.get(product_name)
    if not product:
        print(f"  PRODUCT NOT FOUND  '{product_name}' — skipping patch\n")
        continue

    # Skip if image already set
    if product.get("image_url"):
        print(f"  SKIP patch — '{product_name}' already has an image\n")
        continue

    patch_r = requests.put(
        f"{BASE}/admin/service-products/{product['id']}",
        headers=headers,
        json={"image_url": url},
    )
    if patch_r.status_code == 200:
        print(f"  PATCHED  '{product_name}'\n")
    else:
        print(f"  PATCH FAILED  {patch_r.status_code}: {patch_r.text}\n")

print("Done.")
