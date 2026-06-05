# -*- coding: utf-8 -*-
"""Delete duplicate client entries — keep the one with a logo_url, or the first created."""
import io, sys, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = "http://localhost:8000/v1"

r = requests.post(f"{BASE}/auth/login", json={"email": "admin@wellmangroup.in", "password": "Kar@2005"})
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

all_clients = requests.get(f"{BASE}/admin/clients", headers=headers).json()
print(f"Total clients in DB: {len(all_clients)}")

# Group by (hospital_name.lower, city.lower)
seen = {}
to_delete = []

for c in all_clients:
    key = (c["hospital_name"].strip().lower(), c["city"].strip().lower())
    if key not in seen:
        seen[key] = c
    else:
        existing = seen[key]
        # Keep whichever has a logo_url; if both do, keep existing
        if not existing.get("logo_url") and c.get("logo_url"):
            to_delete.append(existing["id"])
            seen[key] = c
        else:
            to_delete.append(c["id"])

print(f"Duplicates to delete: {len(to_delete)}")
print(f"Unique clients to keep: {len(seen)}")

ok = fail = 0
for cid in to_delete:
    r2 = requests.delete(f"{BASE}/admin/clients/{cid}", headers=headers)
    if r2.status_code in (200, 204):
        ok += 1
    else:
        print(f"  FAIL {cid} -- {r2.status_code}")
        fail += 1

print(f"\nDeleted: {ok}  |  Failed: {fail}")
print(f"Remaining clients: {len(seen)}")
