# -*- coding: utf-8 -*-
"""
Auto-fetch hospital images via DuckDuckGo, upload to Cloudinary,
and update each client record in the database.
Run: python scripts/auto_client_logos.py
"""
import io, sys, time, requests as req
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import cloudinary
import cloudinary.uploader
from ddgs import DDGS

# ── Config ────────────────────────────────────────────────────────────────────
BASE       = "http://localhost:8000/v1"
CLOUD_NAME = "dsshewavy"
API_KEY    = "631528398141673"
API_SECRET = "JoMCgVpc2J_xZKeZMA_u6PsxL_k"

cloudinary.config(cloud_name=CLOUD_NAME, api_key=API_KEY, api_secret=API_SECRET)

# ── Login ─────────────────────────────────────────────────────────────────────
r = req.post(f"{BASE}/auth/login", json={"email": "admin@wellmangroup.in", "password": "Kar@2005"})
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in.")

# ── Fetch all clients without a logo ─────────────────────────────────────────
all_clients = req.get(f"{BASE}/admin/clients", headers=headers).json()
to_process  = [c for c in all_clients if not c.get("logo_url")]
print(f"Clients without logo: {len(to_process)} / {len(all_clients)}\n")

ok = fail = 0

def search_image(hospital_name, city):
    """Try multiple search queries, return first working image URL."""
    queries = [
        f"{hospital_name} {city} hospital",
        f"{hospital_name} {city}",
        f"{hospital_name} Gujarat India hospital",
    ]
    with DDGS() as ddgs:
        for query in queries:
            try:
                results = list(ddgs.images(query, max_results=5))
                if results:
                    return results  # return all so we can try fallbacks
            except Exception:
                pass
            time.sleep(2)
    return []

def upload_image(img_url, client_id):
    """Upload image URL to Cloudinary, return secure_url or None."""
    try:
        up = cloudinary.uploader.upload(
            img_url,
            folder="wellman/clients",
            public_id=f"client_{client_id}",
            overwrite=True,
            resource_type="image",
            timeout=20,
            transformation=[
                {"width": 400, "height": 300, "crop": "fill", "gravity": "center"}
            ]
        )
        return up.get("secure_url")
    except Exception:
        return None

for i, client in enumerate(to_process):
    cid  = client["id"]
    name = client["hospital_name"]
    city = client["city"]

    print(f"[{i+1}/{len(to_process)}] {name}, {city}", end=" ... ", flush=True)

    results = search_image(name, city)
    if not results:
        print("NO IMAGE FOUND")
        fail += 1
        time.sleep(2)
        continue

    # Try each result until one uploads
    uploaded_url = None
    for result in results:
        img_url = result.get("image", "")
        if not img_url:
            continue
        uploaded_url = upload_image(img_url, cid)
        if uploaded_url:
            break

    if not uploaded_url:
        print("UPLOAD FAILED")
        fail += 1
        time.sleep(2)
        continue

    # Update client record
    payload = {
        "hospital_name": name,
        "city": city,
        "state": client["state"],
        "logo_url": uploaded_url,
        "order_index": client["order_index"],
        "is_active": client["is_active"],
    }
    r2 = req.put(f"{BASE}/admin/clients/{cid}", json=payload, headers=headers)
    if r2.status_code in (200, 201):
        print("OK")
        ok += 1
    else:
        print(f"API ERROR {r2.status_code}")
        fail += 1

    # Delay between requests to avoid rate limiting
    time.sleep(3)

print(f"\n{'='*50}")
print(f"Done!  Updated: {ok}  |  Failed: {fail}")
print(f"Check results at: http://localhost:3000/clients")
