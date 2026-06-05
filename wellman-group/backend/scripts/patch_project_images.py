# -*- coding: utf-8 -*-
"""
Finds all projects with no images and attaches an Unsplash image based on service type.
Safe to re-run — skips projects that already have images.
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os, time, random, requests, cloudinary, cloudinary.uploader

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if not os.path.exists(env_path):
        return
    with open(env_path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())

load_env()

UNSPLASH_KEY = os.environ.get('UNSPLASH_ACCESS_KEY', '')
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
)
BASE = "http://localhost:8000/v1"

# Broad fallback queries per service slug — ordered best-first
QUERIES = {
    "modular-operation-theatre": [
        "operating room hospital", "surgical theatre modern", "hospital surgery room",
        "hospital operating theatre", "medical operation room white",
    ],
    "medical-gas-pipeline-system": [
        "hospital corridor modern", "hospital equipment room", "medical facility india",
        "hospital infrastructure modern", "hospital hallway india",
    ],
    "modular-icu-solutions": [
        "hospital ward room beds", "intensive care hospital", "hospital patient room modern",
        "hospital bed room india", "medical ward modern",
    ],
    "modular-nicu-solutions": [
        "hospital baby room", "newborn care hospital", "pediatric hospital room",
        "hospital nursery room", "child hospital care",
    ],
    "ivf-lab-setup": [
        "medical laboratory modern", "science laboratory research", "laboratory clean modern",
        "clinical laboratory india", "research lab modern",
    ],
    "hvac-cleanroom-engineering": [
        "hospital building modern india", "hospital exterior india", "modern hospital india",
        "hospital facility india", "healthcare building modern",
    ],
    "clean-room-solutions": [
        "hospital room clean white", "clean room facility", "hospital white room modern",
        "medical clean facility", "hospital isolation room",
    ],
    "laminar-air-flow-systems": [
        "hospital ventilation system", "hospital ceiling modern", "hospital air system",
        "operating room ceiling", "hospital infrastructure",
    ],
}

def fetch_unsplash(query: str) -> str | None:
    try:
        r = requests.get(
            "https://api.unsplash.com/search/photos",
            params={
                "query": query,
                "client_id": UNSPLASH_KEY,
                "per_page": 10,
                "page": random.randint(1, 3),
                "orientation": "landscape",
                "content_filter": "high",
            },
            timeout=15,
        )
        results = r.json().get("results", []) if r.status_code == 200 else []
        if results:
            return random.choice(results[:5])["urls"]["regular"]
    except Exception:
        pass
    return None

def upload_cloudinary(url: str, pid: str):
    try:
        res = cloudinary.uploader.upload(
            url, folder="wellman/projects", public_id=pid,
            overwrite=True, resource_type="image",
        )
        return res["secure_url"]
    except Exception as e:
        print(f"    Cloudinary error: {e}")
        return None

# ── Main ─────────────────────────────────────────────────────────────────────

r = requests.post(f"{BASE}/auth/login", json={"email": "admin@wellmangroup.in", "password": "Kar@2005"})
if r.status_code != 200:
    print("Login failed"); sys.exit(1)
headers = {"Authorization": f"Bearer {r.json()['access_token']}"}
print("Logged in.\n")

# Get service id → slug map
services = {s["id"]: s["slug"] for s in requests.get(f"{BASE}/services", headers=headers).json()}

# Get all projects (admin list)
all_projects = requests.get(f"{BASE}/admin/projects", headers=headers).json()
print(f"Total projects: {len(all_projects)}")

# Find projects with no images by fetching each detail
needs_image = []
for p in all_projects:
    detail = requests.get(f"{BASE}/projects/{p['slug']}", headers=headers)
    if detail.status_code == 200:
        imgs = detail.json().get("images", [])
        if not imgs:
            needs_image.append({
                "id": p["id"],
                "slug": p["slug"],
                "title": p["title"],
                "service_slug": services.get(p["service_id"], ""),
            })
    time.sleep(0.1)

print(f"Projects without images: {len(needs_image)}\n")
print("-" * 55)

patched = 0
failed = 0

for i, proj in enumerate(needs_image, 1):
    print(f"\n[{i}/{len(needs_image)}] {proj['title']}")
    service_slug = proj["service_slug"]
    queries = QUERIES.get(service_slug, ["hospital modern india", "healthcare facility modern"])

    img_url = None
    for q in queries:
        print(f"  Trying: '{q}'…")
        img_url = fetch_unsplash(q)
        if img_url:
            break
        time.sleep(0.5)

    if not img_url:
        print("  All queries exhausted — skipping")
        failed += 1
        continue

    pub_id = f"proj_patch_{proj['slug'][:35]}"
    cdn_url = upload_cloudinary(img_url, pub_id)
    if not cdn_url:
        failed += 1
        continue

    r = requests.post(
        f"{BASE}/admin/projects/{proj['id']}/images",
        json={"image_url": cdn_url, "caption": proj["title"], "order_index": 0},
        headers=headers,
    )
    if r.status_code in (200, 201):
        print(f"  Attached ✓  ({cdn_url[:60]}…)")
        patched += 1
    else:
        print(f"  Attach failed: {r.status_code}")
        failed += 1

    time.sleep(1.2)

print(f"\n{'=' * 55}")
print(f"  Patched: {patched}  |  Failed: {failed}")
print(f"{'=' * 55}")
