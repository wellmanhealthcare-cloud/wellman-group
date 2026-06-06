# -*- coding: utf-8 -*-
"""
Seed certificates from old wellmangroup.in site.
Downloads certificate images from the live PHP site, uploads to Cloudinary,
then inserts records via the FastAPI /admin/certificates endpoint.

Run from the backend directory:
    python scripts/seed_certificates.py

NOTE: Update issue_date values below if you have the exact certificate dates.
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os
import time
import requests
import cloudinary
import cloudinary.uploader


# ── Load .env ─────────────────────────────────────────────────────────────────

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

cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
)

BASE      = "http://localhost:8000/v1"
OLD_SITE  = "https://wellmangroup.in/img"

# ── Certificate data ──────────────────────────────────────────────────────────
# issue_date: approximate — update from actual certificate documents if needed

CERTIFICATES = [
    {
        "title": "GST Registration Certificate",
        "issuing_body": "GST Council, Government of India",
        "issue_date": "2017-07-01",
        "img_path": "GST-CERTIFICATE.png",
        "public_id": "cert_gst_1",
    },
    {
        "title": "GST Registration Certificate (Page 2)",
        "issuing_body": "GST Council, Government of India",
        "issue_date": "2017-07-01",
        "img_path": "GST-CERTIFICATE-two.png",
        "public_id": "cert_gst_2",
    },
    {
        "title": "MSME Registration Certificate",
        "issuing_body": "Ministry of MSME, Government of India",
        "issue_date": "2019-01-15",
        "img_path": "MSME-CERTIFICATE.png",
        "public_id": "cert_msme_1",
    },
    {
        "title": "MSME Registration Certificate (Page 2)",
        "issuing_body": "Ministry of MSME, Government of India",
        "issue_date": "2019-01-15",
        "img_path": "MSME-CERTIFICATE-two.png",
        "public_id": "cert_msme_2",
    },
    {
        "title": "MSME Registration Certificate (Page 3)",
        "issuing_body": "Ministry of MSME, Government of India",
        "issue_date": "2019-01-15",
        "img_path": "MSME-CERTIFICATE-three.png",
        "public_id": "cert_msme_3",
    },
    {
        "title": "MSME Certificate with Annexure",
        "issuing_body": "Ministry of MSME, Government of India",
        "issue_date": "2019-01-15",
        "img_path": "cer-10.png",
        "public_id": "cert_msme_annexure",
    },
    {
        "title": "IEC Certificate (Import Export Code)",
        "issuing_body": "DGFT, Ministry of Commerce & Industry",
        "issue_date": "2018-04-01",
        "img_path": "IEC-Certificate.png",
        "public_id": "cert_iec",
    },
    {
        "title": "TAN Certificate",
        "issuing_body": "Income Tax Department, Government of India",
        "issue_date": "2015-06-01",
        "img_path": "cer-1.png",
        "public_id": "cert_tan",
    },
    {
        "title": "Zydus Appreciation Certificate",
        "issuing_body": "Zydus Group",
        "issue_date": "2022-03-01",
        "img_path": "cer-2.png",
        "public_id": "cert_zydus",
    },
    {
        "title": "Metaflex Authorised Partner Certificate",
        "issuing_body": "Metaflex",
        "issue_date": "2021-01-01",
        "img_path": "cer-6.png",
        "public_id": "cert_metaflex",
    },
    {
        "title": "OxyMac Product Certification",
        "issuing_body": "Wellman Group",
        "issue_date": "2020-06-01",
        "img_path": "cer-7.png",
        "public_id": "cert_oxymac",
    },
    {
        "title": "Wellman Group Company Certificate",
        "issuing_body": "Wellman Group",
        "issue_date": "2019-01-01",
        "img_path": "cer-8.png",
        "public_id": "cert_wellman",
    },
]


# ── Helpers ───────────────────────────────────────────────────────────────────

def upload_to_cloudinary(image_url: str, public_id: str):
    try:
        result = cloudinary.uploader.upload(
            image_url,
            folder="wellman/certificates",
            public_id=public_id,
            overwrite=True,
            resource_type="image",
        )
        return result["secure_url"]
    except Exception as e:
        print(f"    Cloudinary upload failed: {e}")
        return None


# ── Main ──────────────────────────────────────────────────────────────────────

print("=" * 60)
print("  Wellman Group — Certificate Seeder")
print("=" * 60)

# Login
r = requests.post(f"{BASE}/auth/login", json={
    "email": "admin@wellmangroup.in",
    "password": "Kar@2005"
})
if r.status_code != 200:
    print("Login failed:", r.text)
    sys.exit(1)
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in.\n")

# Load existing certificates to skip duplicates
r = requests.get(f"{BASE}/admin/certificates", headers=headers)
existing_titles = {c["title"] for c in r.json()} if r.status_code == 200 else set()
print(f"Existing certificates: {len(existing_titles)}\n")
print("-" * 60)

success = 0
skipped = 0
failed  = 0

for i, cert in enumerate(CERTIFICATES, 1):
    print(f"\n[{i}/{len(CERTIFICATES)}] {cert['title']}")

    if cert["title"] in existing_titles:
        print("  SKIP — already exists")
        skipped += 1
        continue

    img_url = f"{OLD_SITE}/{cert['img_path']}"

    # 1. Upload to Cloudinary
    print(f"  Uploading from {cert['img_path']} …")
    cdn_url = upload_to_cloudinary(img_url, cert["public_id"])

    if not cdn_url:
        print("  FAIL — Cloudinary upload failed, skipping")
        failed += 1
        continue

    print(f"  Cloudinary OK: {cdn_url[:60]}…")

    # 2. Create certificate record
    payload = {
        "title": cert["title"],
        "issuing_body": cert["issuing_body"],
        "issue_date": cert["issue_date"],
        "file_url": cdn_url,
        "order_index": i,
        "is_active": True,
    }
    r = requests.post(f"{BASE}/admin/certificates", json=payload, headers=headers)
    if r.status_code in (200, 201):
        print(f"  Created ✓")
        success += 1
    else:
        print(f"  FAIL — API: {r.status_code}: {r.text[:120]}")
        failed += 1

    time.sleep(0.5)

print("\n" + "=" * 60)
print(f"  Done.  Created: {success}  |  Skipped: {skipped}  |  Failed: {failed}")
print("=" * 60)
print("\nTIP: Update issue_date values via /admin/certificates if you have exact dates.")
