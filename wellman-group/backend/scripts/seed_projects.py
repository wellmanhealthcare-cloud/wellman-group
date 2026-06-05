# -*- coding: utf-8 -*-
"""
Seed 20 real hospital project entries with Unsplash images.
Reads UNSPLASH_ACCESS_KEY from backend/.env (or env var).
Requires: backend running on localhost:8000, Cloudinary configured.

Run: python scripts/seed_projects.py
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os
import re
import time
import random
import requests
import cloudinary
import cloudinary.uploader

# ── Load .env ────────────────────────────────────────────────────────────────

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
if not UNSPLASH_KEY:
    print("ERROR: UNSPLASH_ACCESS_KEY not found in .env")
    print("  Add:  UNSPLASH_ACCESS_KEY=your_key_here  to backend/.env")
    sys.exit(1)

cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET'),
)

BASE = "http://localhost:8000/v1"

# ── Project data (real hospitals from company profile PDFs) ──────────────────
# service field = slug; query = Unsplash search term
# Multiple queries per service type so images vary across projects

PROJECTS = [
    # ── Modular OT ─────────────────────────────────────────────────────────
    {
        "title": "4-Theatre Modular OT Complex",
        "client_name": "Metas Adventist Mission Hospital",
        "city": "Surat", "state": "Gujarat",
        "service": "modular-operation-theatre",
        "description": "Design, supply and commissioning of a 4-theatre Modular OT complex to NABH and JCI standards. Scope included Corian wall panelling, vertical LAF units, dedicated AHUs per OT, integrated OT control panels and full MGPS connectivity.",
        "completion_date": "2023-03-15",
        "is_featured": True,
        "query": "modern operating room hospital clean",
    },
    {
        "title": "3-Theatre Modular OT Suite",
        "client_name": "Tristar Hospital",
        "city": "Surat", "state": "Gujarat",
        "service": "modular-operation-theatre",
        "description": "Turnkey installation of 3 Modular Operation Theatres with GI PUF panel walls, vinyl flooring, laminar air flow units and fully integrated surgeon control panels. All theatres commissioned to Class 100/ISO 5.",
        "completion_date": "2022-11-20",
        "is_featured": True,
        "query": "surgical theatre laminar flow hospital",
    },
    {
        "title": "Twin Modular OT — Superspeciality Block",
        "client_name": "Sunshine Global Hospital",
        "city": "Vadodara", "state": "Gujarat",
        "service": "modular-operation-theatre",
        "description": "Two Superspeciality OTs for Sunshine Global's new surgical block — ACP/HPL PUF panel walls, 8×6 ft plenum LAF units, dedicated HVAC with positive pressure and full OT control panels with gas alarm integration.",
        "completion_date": "2023-07-10",
        "is_featured": True,
        "query": "operation theatre hospital room modern clean",
    },
    {
        "title": "Modular OT with ICU — Dialysis Centre",
        "client_name": "Apex Dialysis Center",
        "city": "Palanpur", "state": "Gujarat",
        "service": "modular-operation-theatre",
        "description": "Combined Modular OT and 6-bed ICU setup for a dialysis and surgical centre. SS PUF panel walls throughout, coved flooring, pendant systems in ICU and full MGPS across both zones.",
        "completion_date": "2022-08-05",
        "is_featured": False,
        "query": "hospital intensive care clean room",
    },
    {
        "title": "General OT Suite",
        "client_name": "Coral Hospital",
        "city": "Vadodara", "state": "Gujarat",
        "service": "modular-operation-theatre",
        "description": "Single-theatre Modular OT to General OT specification — Class 1000/ISO 6. Vinyl wall panelling, 6×4 ft LAF unit, integrated OT lights and hatch box.",
        "completion_date": "2021-04-22",
        "is_featured": False,
        "query": "clean room hospital white modern",
    },
    {
        "title": "Eye Surgery OT",
        "client_name": "ASG Eye Hospital",
        "city": "Surat", "state": "Gujarat",
        "service": "modular-operation-theatre",
        "description": "Specialist Ophthalmology OT with ultra-clean ISO 5 environment. Compact laminar flow unit over the surgical microscope position, seamless Corian walls and purpose-built LED lighting optimised for ophthalmic procedures.",
        "completion_date": "2022-05-18",
        "is_featured": False,
        "query": "hospital surgery room clean white",
    },
    # ── MGPS ───────────────────────────────────────────────────────────────
    {
        "title": "250-Bed MGPS Installation",
        "client_name": "Nutan Medical College & Hospital",
        "city": "Visnagar", "state": "Gujarat",
        "service": "medical-gas-pipeline-system",
        "description": "Full hospital MGPS installation across 250 beds — OT, ICU, ward and emergency zones. Mexflow BS EN 13348:2008 copper piping, auto-changeover O₂ manifold, digital area alarm system and 250+ British Standard gas outlets.",
        "completion_date": "2021-09-30",
        "is_featured": True,
        "query": "hospital medical equipment corridor india",
    },
    {
        "title": "Medical Gas Pipeline — Cancer Centre",
        "client_name": "HCG Cancer Hospital",
        "city": "Ahmedabad", "state": "Gujarat",
        "service": "medical-gas-pipeline-system",
        "description": "MGPS for a specialised cancer treatment facility including O₂, N₂O, CO₂, medical air and vacuum across OT, ICU and ward zones. Fully automatic control panels with master alarm system and zonal valve boxes at each zone.",
        "completion_date": "2022-02-14",
        "is_featured": True,
        "query": "hospital piping system medical facility",
    },
    {
        "title": "100-Bed MGPS Project",
        "client_name": "Bhagyoday Hospital",
        "city": "Kadi", "state": "Gujarat",
        "service": "medical-gas-pipeline-system",
        "description": "Complete MGPS for a 100-bed general hospital. Nitrogen-purged copper piping, O₂ and N₂O manifolds, bed head panels across all wards and digital area alarm panels in ICU and OT zones.",
        "completion_date": "2020-12-10",
        "is_featured": False,
        "query": "hospital ward medical gas outlet panel",
    },
    {
        "title": "MGPS — Multi-speciality Hospital",
        "client_name": "GCS Medical College & Hospital",
        "city": "Ahmedabad", "state": "Gujarat",
        "service": "medical-gas-pipeline-system",
        "description": "Large-scale MGPS installation for a teaching hospital. Project scope included copper piping network across 6 floors, O₂ central manifold room, vacuum plant, medical air plant with dryer and 300+ gas outlet points.",
        "completion_date": "2021-06-25",
        "is_featured": False,
        "query": "hospital medical gas pipeline copper installation",
    },
    # ── ICU ────────────────────────────────────────────────────────────────
    {
        "title": "12-Bed Modular ICU",
        "client_name": "Surmount Hospital",
        "city": "Gandhinagar", "state": "Gujarat",
        "service": "modular-icu-solutions",
        "description": "12-bed Modular ICU with ISO 7/Class 10,000 clean environment. GI PUF panel walls, dedicated HVAC with positive pressure, MGPS bed head panels at every bay, pendant systems and full electrical and nurse call infrastructure.",
        "completion_date": "2023-01-08",
        "is_featured": True,
        "query": "intensive care unit hospital modern",
    },
    {
        "title": "8-Bed ICU — Isolation Setup",
        "client_name": "Iris Hospital",
        "city": "Anand", "state": "Gujarat",
        "service": "modular-icu-solutions",
        "description": "8-bed modular ICU with 2 negative-pressure isolation bays for infection control. Individual HVAC zones per bay, MGPS panels, pendant systems and antimicrobial surface finishes throughout.",
        "completion_date": "2022-09-15",
        "is_featured": False,
        "query": "hospital ICU isolation room modern",
    },
    # ── NICU ───────────────────────────────────────────────────────────────
    {
        "title": "12-Bay Modular NICU",
        "client_name": "Vibrant Hospital",
        "city": "Vapi", "state": "Gujarat",
        "service": "modular-nicu-solutions",
        "description": "Purpose-built 12-bay Modular NICU with ISO 7 clean environment. Individual O₂, medical air and vacuum service per incubator bay, low-turbulence HVAC, anti-microbial finishes and optimised low-glare lighting throughout.",
        "completion_date": "2022-06-30",
        "is_featured": True,
        "query": "neonatal intensive care unit hospital",
    },
    {
        "title": "8-Bay NICU",
        "client_name": "Nice Children Hospital",
        "city": "Viramgam", "state": "Gujarat",
        "service": "modular-nicu-solutions",
        "description": "Modular NICU for a dedicated paediatric hospital — 8 incubator bays with individual MGPS services, positive pressure HVAC and antimicrobial wall panels. Designed for minimal sound transmission to support neonatal recovery.",
        "completion_date": "2021-11-05",
        "is_featured": False,
        "query": "neonatal care baby hospital room",
    },
    # ── IVF Lab ────────────────────────────────────────────────────────────
    {
        "title": "ISO Class 5 IVF Laboratory",
        "client_name": "Radha Hospital & Candora IVF",
        "city": "Surat", "state": "Gujarat",
        "service": "ivf-lab-setup",
        "description": "End-to-end IVF laboratory setup — ISO Class 5 cleanroom with VOC-free Corian wall panels, HEPA-filtered HVAC with CO₂ and N₂ gas supply, laminar flow workstations and interlocked clean room doors. Fully compliant with ICMR guidelines.",
        "completion_date": "2023-05-20",
        "is_featured": True,
        "query": "laboratory clean room modern research",
    },
    {
        "title": "IVF Lab Setup — Fertility Centre",
        "client_name": "Priya Nursing Home",
        "city": "Anand", "state": "Gujarat",
        "service": "ivf-lab-setup",
        "description": "Complete IVF embryology laboratory including ISO 5 cleanroom construction, VOC-free materials, CO₂ incubator gas supply, LAF workstations and precision HVAC.",
        "completion_date": "2022-03-12",
        "is_featured": False,
        "query": "fertility clinic laboratory modern",
    },
    # ── HVAC & Cleanroom ───────────────────────────────────────────────────
    {
        "title": "NABH-Compliant HVAC — Multi-OT Block",
        "client_name": "Kothari Multi-speciality Hospital",
        "city": "Vadodara", "state": "Gujarat",
        "service": "hvac-cleanroom-engineering",
        "description": "Design and installation of dedicated HVAC systems for a 4-OT block — separate AHU per OT, precise temperature and humidity control to NABH specs, positive pressure cascades and full validation documentation.",
        "completion_date": "2022-12-01",
        "is_featured": False,
        "query": "hospital hvac air handling unit clean",
    },
    # ── Clean Room ─────────────────────────────────────────────────────────
    {
        "title": "Negative Pressure Isolation Room",
        "client_name": "Bhagyoday Hospital",
        "city": "Kadi", "state": "Gujarat",
        "service": "clean-room-solutions",
        "description": "Single negative-pressure isolation room built to ISO 7 for infection control. Sealed modular wall panels, dedicated exhaust AHU maintaining negative pressure, HEPA-filtered supply air and interlocked door system.",
        "completion_date": "2023-02-28",
        "is_featured": False,
        "query": "hospital isolation room clean modern",
    },
    # ── LAF ────────────────────────────────────────────────────────────────
    {
        "title": "LAF Unit Retrofit — Surgical Theatre",
        "client_name": "Smt. Maroliya Hospital",
        "city": "Navsari", "state": "Gujarat",
        "service": "laminar-air-flow-systems",
        "description": "Retrofit installation of a vertical laminar air flow unit into an existing OT — 8×6 ft plenum box, H14 HEPA filters, new AHU and ducting. Achieved ISO 5/Class 100 at commissioning validation.",
        "completion_date": "2020-09-14",
        "is_featured": False,
        "query": "hospital ceiling ventilation clean room",
    },
    # ── MOT (final featured) ───────────────────────────────────────────────
    {
        "title": "Superspeciality OT — BAPS Hospital",
        "client_name": "BAPS Pramukh Swami Hospital",
        "city": "Surat", "state": "Gujarat",
        "service": "modular-operation-theatre",
        "description": "High-specification Superspeciality OT for Cardiothoracic surgery. Corian wall panels with PTFE-sealed joints, 8×6 ft vertical LAF with dual-stage HEPA filtration, complete OT control panel and integrated pendant system.",
        "completion_date": "2023-09-01",
        "is_featured": True,
        "query": "modern hospital operating theatre white",
    },
]

# ── Helpers ──────────────────────────────────────────────────────────────────

def fetch_unsplash_image(query: str, page: int = 1) -> str | None:
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "client_id": UNSPLASH_KEY,
        "per_page": 10,
        "page": page,
        "orientation": "landscape",
        "content_filter": "high",
    }
    try:
        r = requests.get(url, params=params, timeout=15)
        if r.status_code != 200:
            print(f"    Unsplash error {r.status_code}: {r.text[:100]}")
            return None
        results = r.json().get("results", [])
        if not results:
            return None
        img = random.choice(results[:5])
        return img["urls"]["regular"]
    except Exception as e:
        print(f"    Unsplash request failed: {e}")
        return None


def upload_to_cloudinary(image_url: str, public_id: str) -> tuple[str, str] | tuple[None, None]:
    try:
        result = cloudinary.uploader.upload(
            image_url,
            folder="wellman/projects",
            public_id=public_id,
            overwrite=True,
            resource_type="image",
        )
        return result["secure_url"], result["public_id"]
    except Exception as e:
        print(f"    Cloudinary upload failed: {e}")
        return None, None


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')[:80]


# ── Main ─────────────────────────────────────────────────────────────────────

print("=" * 60)
print("  Wellman Group — Project Seeder with Unsplash Images")
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

# Load services
r = requests.get(f"{BASE}/services", headers=headers)
service_map = {s["slug"]: s["id"] for s in r.json()}
print(f"Loaded {len(service_map)} services.\n")

# Load existing project slugs to skip duplicates
r = requests.get(f"{BASE}/admin/projects", headers=headers)
existing_slugs = {p["slug"] for p in r.json()} if r.status_code == 200 else set()
print(f"Existing projects: {len(existing_slugs)}\n")
print("-" * 60)

success = 0
skipped = 0
failed = 0

for i, proj in enumerate(PROJECTS, 1):
    slug = slugify(f"{proj['title']}-{proj['client_name']}")
    service_id = service_map.get(proj["service"])

    print(f"\n[{i}/{len(PROJECTS)}] {proj['client_name']} — {proj['title']}")

    if slug in existing_slugs:
        print("  SKIP — already exists")
        skipped += 1
        continue

    if not service_id:
        print(f"  SKIP — service '{proj['service']}' not found in DB")
        skipped += 1
        continue

    # 1. Create project
    payload = {
        "title": proj["title"],
        "slug": slug,
        "client_name": proj["client_name"],
        "city": proj["city"],
        "state": proj["state"],
        "service_id": service_id,
        "description": proj["description"],
        "completion_date": proj["completion_date"],
        "is_featured": proj["is_featured"],
        "is_active": True,
        "order_index": i,
        "meta_title": f"{proj['title']} | Wellman Group",
        "meta_desc": proj["description"][:160],
    }
    r = requests.post(f"{BASE}/admin/projects", json=payload, headers=headers)
    if r.status_code not in (200, 201):
        print(f"  FAIL — create project: {r.status_code}: {r.text[:100]}")
        failed += 1
        continue

    project_id = r.json()["id"]
    print(f"  Created project (id: {project_id[:8]}…)")

    # 2. Fetch Unsplash image
    page = random.randint(1, 4)
    print(f"  Fetching image: '{proj['query']}' (page {page})…")
    img_url = fetch_unsplash_image(proj["query"], page)

    if not img_url:
        # Fallback query
        img_url = fetch_unsplash_image("hospital modern india", random.randint(1, 3))

    if not img_url:
        print("  No image found — project created without image")
        success += 1
        time.sleep(0.5)
        continue

    # 3. Upload to Cloudinary
    public_id = f"proj_{slugify(proj['client_name'])[:30]}"
    print(f"  Uploading to Cloudinary…")
    cdn_url, cdn_pid = upload_to_cloudinary(img_url, public_id)

    if not cdn_url:
        print("  Cloudinary failed — project created without image")
        success += 1
        time.sleep(0.5)
        continue

    # 4. Attach image to project
    r = requests.post(
        f"{BASE}/admin/projects/{project_id}/images",
        json={"image_url": cdn_url, "caption": proj["title"], "order_index": 0},
        headers=headers,
    )
    if r.status_code in (200, 201):
        print(f"  Image attached ✓  ({cdn_url[:60]}…)")
    else:
        print(f"  Image upload to project failed: {r.status_code}")

    success += 1
    time.sleep(1.2)  # Unsplash rate limit: 50 req/hour — 1.2s gap is safe

print("\n" + "=" * 60)
print(f"  Done.  Created: {success}  |  Skipped: {skipped}  |  Failed: {failed}")
print("=" * 60)
