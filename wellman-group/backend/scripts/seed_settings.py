# -*- coding: utf-8 -*-
"""Seed real company data into site_settings via API."""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import requests

BASE = "http://localhost:8000/v1"

# 1. Login
r = requests.post(f"{BASE}/auth/login", json={
    "email": "admin@wellmangroup.in",
    "password": "Kar@2005"
})
if r.status_code != 200:
    print("Login failed:", r.text)
    sys.exit(1)

token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in.")

# 2. Update site settings
settings = {
    "company_name": "Wellman Group",
    "tagline": "Building the Future of Healthcare Infrastructure",
    "unit_address": "50, 51, 88 Parishram Industrial Hub, Vasna Chacharwadi, Sarkhej-Bavla Highway, Changodar, Ahmedabad 382213",
    "office_address": "B-414, WTT (World Trade Tower), Nr. Sarkhej-Sanand Cross Road, Makrba, Off S.G. Highway, Ahmedabad",
    "phone_primary": "+91 94094 28888",
    "phone_secondary": "",
    "email_primary": "info@wellmangroup.in",
    "email_secondary": "",
    "whatsapp_number": "919409428888",
    "instagram_url": "",
    "facebook_url": "",
    "linkedin_url": "",
    "youtube_url": "",
    "google_maps_url": "",
    "brochure_url": "",
    "footer_text": "2025 Wellman Group. All rights reserved. Delivering world-class healthcare infrastructure across India.",
    "meta_title": "Wellman Group | Healthcare Infrastructure Solutions - MOT, MGPS, HVAC, ICU",
    "meta_desc": "Wellman Group is Ahmedabad's leading healthcare infrastructure company. We design, supply, install and commission Modular Operation Theatres, Medical Gas Pipeline Systems, HVAC Cleanrooms, ICU, NICU and IVF Lab solutions across India.",
}

r = requests.put(f"{BASE}/admin/settings", json=settings, headers=headers)
print("Settings:", r.status_code, r.json())

# 3. Seed 8 services (full list from spec)
services = [
    {
        "title": "Modular Operation Theatre",
        "slug": "modular-operation-theatre",
        "short_desc": "Jointless, seamless modular OT structures engineered to maintain a 0.3-micron clean environment with precise temperature, pressure and humidity control.",
        "long_desc": "Wellman Group designs and installs state-of-the-art Modular Operation Theatres that meet NABH and international healthcare standards. Our MOT systems feature jointless wall-ceiling-floor panels, positive pressure laminar air flow, integrated LED OT lights, and medical-grade finishes — creating a truly infection-free surgical environment. Each theatre is engineered to specification, from single OT suites to multi-theatre complexes.",
        "order_index": 1,
        "is_active": True,
        "meta_title": "Modular Operation Theatre | Wellman Group",
        "meta_desc": "NABH-compliant Modular OT systems designed and installed by Wellman Group. Jointless, seamless structure with laminar air flow and precision climate control."
    },
    {
        "title": "Medical Gas Pipeline System",
        "slug": "medical-gas-pipeline-system",
        "short_desc": "OxyMac™ MGPS — BS EN 13348:2008 and Lloyd certified medical gas pipeline systems supplying O₂, N₂O, CO₂, vacuum and medical air across hospital zones.",
        "long_desc": "Our OxyMac™ Medical Gas Pipeline Systems are designed, supplied and commissioned by certified biomedical engineers. We use carbon-free copper piping, medical-grade fittings and Harris O brazing rods from USA. Every installation is nitrogen purged, pressure tested and handed over with a full compliance certificate. We cover all gases — Oxygen, Nitrous Oxide, Carbon Dioxide, Medical Air and Vacuum — across ICU, OT, Ward and Emergency zones.",
        "order_index": 2,
        "is_active": True,
        "meta_title": "Medical Gas Pipeline System (MGPS) | Wellman Group",
        "meta_desc": "OxyMac™ MGPS by Wellman Group — BS EN 13348:2008 certified medical gas pipeline systems for hospitals across India."
    },
    {
        "title": "HVAC & Cleanroom Engineering",
        "slug": "hvac-cleanroom-engineering",
        "short_desc": "Precision HVAC systems engineered for hospital environments — controlling temperature, humidity, pressure differentials and air changes per hour to international standards.",
        "long_desc": "Wellman Group designs and installs HVAC systems specifically for healthcare environments, including OTs, ICUs, NICUs and cleanrooms. Our systems comply with ASHRAE, NABH and international cleanroom standards, delivering the exact air changes, filtration levels and differential pressures required in each clinical zone. We handle everything from duct design to AHU installation and commissioning.",
        "order_index": 3,
        "is_active": True,
        "meta_title": "HVAC & Cleanroom Engineering | Wellman Group",
        "meta_desc": "Hospital-grade HVAC and cleanroom systems by Wellman Group — engineered for OTs, ICUs and NICUs to NABH and international standards."
    },
    {
        "title": "Clean Room Solutions",
        "slug": "clean-room-solutions",
        "short_desc": "ISO-classified cleanroom solutions for pharmaceutical manufacturing, laboratory and healthcare applications — turnkey design, build and validation.",
        "long_desc": "Our cleanroom solutions span ISO Class 5 through Class 8 environments for pharmaceutical, biotech, laboratory and hospital settings. We provide complete turnkey delivery — from cleanroom design and panel installation to HVAC integration, validation and certification. Our cleanrooms meet GMP, FDA and WHO requirements.",
        "order_index": 4,
        "is_active": True,
        "meta_title": "Clean Room Solutions | Wellman Group",
        "meta_desc": "ISO-classified cleanroom design and build by Wellman Group — GMP-compliant solutions for pharma, labs and healthcare facilities."
    },
    {
        "title": "Laminar Air Flow Systems",
        "slug": "laminar-air-flow-systems",
        "short_desc": "Vertical and horizontal laminar air flow units for OTs and critical care areas — delivering HEPA-filtered unidirectional air to maintain a sterile field.",
        "long_desc": "Wellman Group supplies and installs laminar air flow (LAF) systems that create an ultra-clean sterile zone directly over the operating table. Our LAF units use H14 HEPA filters and deliver unidirectional, particle-free air at the correct velocity. Available in vertical and horizontal configurations for modular OTs, cath labs and sterile processing areas.",
        "order_index": 5,
        "is_active": True,
        "meta_title": "Laminar Air Flow Systems | Wellman Group",
        "meta_desc": "HEPA-filtered laminar air flow systems for Modular OTs and critical care — supplied and installed by Wellman Group."
    },
    {
        "title": "Modular ICU Solutions",
        "slug": "modular-icu-solutions",
        "short_desc": "Fully equipped modular ICU setups with integrated MGPS, HVAC, pendant systems and infection-control wall panels — designed for rapid deployment.",
        "long_desc": "Our Modular ICU Solutions deliver fully functional intensive care environments with minimal site disruption. We integrate MGPS bed-head panels, medical pendant systems, infection-control modular wall panels, dedicated HVAC with negative or positive pressure, and full electrical and data infrastructure. Suitable for new hospitals, ICU expansions and upgrades of existing units.",
        "order_index": 6,
        "is_active": True,
        "meta_title": "Modular ICU Solutions | Wellman Group",
        "meta_desc": "Turnkey Modular ICU setups by Wellman Group — MGPS, HVAC, pendants and infection-control panels integrated for fast deployment."
    },
    {
        "title": "Modular NICU Solutions",
        "slug": "modular-nicu-solutions",
        "short_desc": "Specialist modular NICU environments designed for neonatal care — with precise thermal control, low-noise HVAC and dedicated gas services at every bay.",
        "long_desc": "Wellman Group delivers purpose-built Modular NICU environments that meet the precise thermal, acoustic and clinical requirements of neonatal intensive care. Our NICU setups include individual bay gas services (O₂, medical air, vacuum), low-turbulence HVAC, anti-microbial surface finishes and optimised lighting — creating the safest possible environment for premature and critically ill newborns.",
        "order_index": 7,
        "is_active": True,
        "meta_title": "Modular NICU Solutions | Wellman Group",
        "meta_desc": "Specialist Modular NICU environments by Wellman Group — precise thermal control, dedicated gas services and infection-control finishes."
    },
    {
        "title": "IVF Lab Setup",
        "slug": "ivf-lab-setup",
        "short_desc": "End-to-end IVF laboratory design and setup — cleanroom classification, VOC-free materials, precision HVAC and dedicated gas supply for embryology labs.",
        "long_desc": "A successful IVF lab demands the most stringent environmental controls of any clinical space. Wellman Group delivers complete IVF laboratory setups including ISO Class 5 cleanroom construction, VOC-free building materials, purpose-built HVAC with HEPA filtration and CO₂/N₂ gas supply systems. We work with fertility clinics and IVF centres to design labs that maximise embryo viability and comply with ICMR guidelines.",
        "order_index": 8,
        "is_active": True,
        "meta_title": "IVF Lab Setup | Wellman Group",
        "meta_desc": "Complete IVF laboratory setup by Wellman Group — ISO cleanroom, VOC-free materials and precision HVAC for embryology labs."
    },
]

print("\nSeeding services...")
for svc in services:
    r = requests.post(f"{BASE}/services", json=svc, headers=headers)
    if r.status_code in (200, 201):
        print(f"  OK  {svc['title']}")
    elif "already" in r.text.lower() or "unique" in r.text.lower() or r.status_code == 400:
        print(f"  SKIP {svc['title']} -- already exists")
    else:
        print(f"  FAIL {svc['title']} -- {r.status_code}: {r.text}")

# 4. Seed team members
# Full team from company profile PDF (section 4) + Mr. Amin (existing)
all_team = [
    {
        "name": "Prithvi Solanki",
        "designation": "Managing Director",
        "bio": "MBA (Healthcare Management) & Biomedical & Instrumentation Engineer with 10+ years of experience in MGPS designing and NABH consultancy.",
        "linkedin_url": "",
        "order_index": 1,
        "is_active": True,
    },
    {
        "name": "Krunal Smart",
        "designation": "Head of MOT Design & Site Planning",
        "bio": "Biomedical & Instrumentation Engineer currently pursuing Ex. MBA (PGP) from IIM-Ahmedabad. 10+ years of experience in Modular OT designing and hospital site planning.",
        "linkedin_url": "",
        "order_index": 2,
        "is_active": True,
    },
    {
        "name": "Gaurang Kalathiya",
        "designation": "Head of Panel & OT Equipment",
        "bio": "Biomedical & Instrumentation Engineer with 10+ years of experience in OT panel designing and modular OT equipment manufacturing.",
        "linkedin_url": "",
        "order_index": 3,
        "is_active": True,
    },
    {
        "name": "Ankur Patel",
        "designation": "Hospital Project Manager",
        "bio": "MBA (Marketing) & Biomedical Engineer with 8+ years of experience in hospital project planning, procurement and execution. Sound knowledge of NABH & JCI standards.",
        "linkedin_url": "",
        "order_index": 4,
        "is_active": True,
    },
    {
        "name": "Hiten Chilodiya",
        "designation": "Head of After-Sales Service",
        "bio": "Biomedical Engineer with 10+ years of experience providing post-sales service and technical support for healthcare infrastructure projects.",
        "linkedin_url": "",
        "order_index": 5,
        "is_active": True,
    },
    {
        "name": "Anand Patel",
        "designation": "Head of Sales & Networking",
        "bio": "Biomedical & Instrumentation Engineer with 10+ years of experience managing sales and hospital networking across Gujarat and India.",
        "linkedin_url": "",
        "order_index": 6,
        "is_active": True,
    },
    {
        "name": "Mr. Amin",
        "designation": "Senior Field Specialist",
        "bio": "25+ years of hands-on experience in site handling, inspection and technical operations for healthcare infrastructure projects.",
        "linkedin_url": "",
        "order_index": 7,
        "is_active": True,
    },
]

print("\nSeeding team members...")
# Fetch existing names to avoid duplicates on re-run
r = requests.get(f"{BASE}/admin/team", headers=headers)
existing_names = {m["name"] for m in r.json()} if r.status_code == 200 else set()

for member in all_team:
    if member["name"] in existing_names:
        print(f"  SKIP {member['name']} -- already exists")
        continue
    r = requests.post(f"{BASE}/admin/team", json=member, headers=headers)
    if r.status_code in (200, 201):
        print(f"  OK  {member['name']}")
    else:
        print(f"  FAIL {member['name']} -- {r.status_code}: {r.text}")

print("\nDone.")
