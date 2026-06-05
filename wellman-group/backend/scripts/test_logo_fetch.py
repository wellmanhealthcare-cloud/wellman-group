# -*- coding: utf-8 -*-
"""Test logo fetch on 3 clients before running the full batch."""
import io, sys, time, requests as req
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import cloudinary
import cloudinary.uploader
from duckduckgo_search import DDGS

BASE       = "http://localhost:8000/v1"
CLOUD_NAME = "dsshewavy"
API_KEY    = "631528398141673"
API_SECRET = "JoMCgVpc2J_xZKeZMA_u6PsxL_k"

cloudinary.config(cloud_name=CLOUD_NAME, api_key=API_KEY, api_secret=API_SECRET)

r = req.post(f"{BASE}/auth/login", json={"email": "admin@wellmangroup.in", "password": "Kar@2005"})
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Test with 3 well-known hospitals
test_clients = [
    {"id": None, "hospital_name": "KD Hospital", "city": "Ahmedabad", "state": "Gujarat"},
    {"id": None, "hospital_name": "Tristar Hospital", "city": "Surat", "state": "Gujarat"},
    {"id": None, "hospital_name": "Sunshine Global Hospital", "city": "Vadodara", "state": "Gujarat"},
]

# Get real IDs from API
all_clients = req.get(f"{BASE}/admin/clients", headers=headers).json()
id_map = {(c["hospital_name"].lower(), c["city"].lower()): c["id"] for c in all_clients}

for tc in test_clients:
    key = (tc["hospital_name"].lower(), tc["city"].lower())
    tc["id"] = id_map.get(key)

print("Testing logo fetch on 3 hospitals...\n")

for client in test_clients:
    if not client["id"]:
        print(f"  NOT FOUND in DB: {client['hospital_name']}")
        continue

    name  = client["hospital_name"]
    city  = client["city"]
    query = f"{name} {city} hospital logo"
    print(f"Searching: {query}")

    try:
        results = []
        with DDGS() as ddgs:
            for img in ddgs.images(query, max_results=3):
                results.append(img)

        if not results:
            print(f"  No results found\n")
            continue

        print(f"  Found {len(results)} images. Uploading first...")
        img_url = results[0].get("image", "")

        up = cloudinary.uploader.upload(
            img_url,
            folder="wellman/clients",
            public_id=f"client_{client['id']}",
            overwrite=True,
            resource_type="image",
            timeout=15,
        )
        uploaded_url = up.get("secure_url", "")
        print(f"  Uploaded: {uploaded_url}")

        # Update via API
        payload = {
            "hospital_name": name,
            "city": city,
            "state": client["state"],
            "logo_url": uploaded_url,
            "order_index": 1,
            "is_active": True,
        }
        r2 = req.put(f"{BASE}/admin/clients/{client['id']}", json=payload, headers=headers)
        print(f"  API update: {r2.status_code}\n")

    except Exception as e:
        print(f"  ERROR: {e}\n")

    time.sleep(2)

print("Test done. Check http://localhost:3000/admin/clients to see results.")
