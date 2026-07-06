# -*- coding: utf-8 -*-
"""Delete all existing projects and replace with the new client project list."""
import io, sys, requests
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE = "http://localhost:8000/v1"

r = requests.post(f"{BASE}/auth/login", json={"email": "admin@wellmangroup.in", "password": "Kar@2005"})
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

services = {s["slug"]: s["id"] for s in requests.get(f"{BASE}/products").json()}

MOT = services["modular-operation-theatre"]
MGPS = services["medical-gas-pipeline-system"]
HVAC = services["hvac-cleanroom-engineering"]
CLEANROOM = services["clean-room-solutions"]
LAF = services["laminar-air-flow-systems"]
ICU = services["modular-icu-solutions"]
NICU = services["modular-nicu-solutions"]
IVF = services["ivf-lab-setup"]

PROJECTS = [
    # MOT
    dict(title="4-Theatre Modular OT", client_name="Rhythm Hospital", city="Kadi", service_id=MOT,
         description="Design, supply and installation of a 4-theatre Modular Operation Theatre complex for Rhythm Hospital, Kadi — built to NABH Class 100/ISO 5 standards.",
         completion_date="2023-02-10"),
    dict(title="2-Theatre Modular OT", client_name="Mahershi Hospital", city="Surendranagar", service_id=MOT,
         description="Twin Modular Operation Theatre installation for Mahershi Hospital, Surendranagar, with jointless wall panelling and dedicated laminar air flow units.",
         completion_date="2023-04-18"),
    dict(title="3-Theatre Modular OT", client_name="Tulip Super Speciality Hospital", city="Anand", service_id=MOT,
         description="3-theatre Modular OT suite delivered for Tulip Super Speciality Hospital, Anand, covering superspeciality and general surgery requirements.",
         completion_date="2022-09-05"),
    dict(title="2-Theatre Modular OT", client_name="Kim's Hospital", city="Ahmedabad", service_id=MOT,
         description="2-theatre Modular Operation Theatre setup for Kim's Hospital, Ahmedabad, with full NABH-compliant infection control systems.",
         completion_date="2022-12-01"),
    dict(title="3-Theatre Modular OT", client_name="Shremay Spine Care", city="Ahmedabad", service_id=MOT,
         description="3-theatre Modular OT complex for Shremay Spine Care, Ahmedabad, engineered for orthopedic and spine surgery workflows.",
         completion_date="2023-06-22"),
    dict(title="2-Theatre Modular OT", client_name="Aashvi ENT Hospital", city="Ahmedabad", service_id=MOT,
         description="2-theatre Modular OT installation for Aashvi ENT Hospital, Ahmedabad, tailored to ENT surgical procedures.",
         completion_date="2023-08-14"),
    dict(title="2-Theatre Modular OT", client_name="Sterility Cancer Hospital", city="Ahmedabad", service_id=MOT,
         description="2-theatre Modular OT setup for Sterility Cancer Hospital, Ahmedabad, built for oncology surgical requirements.",
         completion_date="2024-01-20"),

    # MGPS
    dict(title="250-Bed MGPS Installation", client_name="KD Hospital", city="Ahmedabad", service_id=MGPS,
         description="Medical Gas Pipeline System designed and installed across a 250-bed facility at KD Hospital, Ahmedabad, including manifold, alarms and bed head panels.",
         completion_date="2022-05-11"),
    dict(title="250-Bed MGPS Installation", client_name="Satya Sai Hospital", city="Ahmedabad", service_id=MGPS,
         description="Full 250-bed Medical Gas Pipeline System for Satya Sai Hospital, Ahmedabad, with copper piping to BS EN 13348:2008 standards.",
         completion_date="2022-10-27"),
    dict(title="130-Bed MGPS Installation", client_name="Thkeshi Hospital", city="Rajkot", service_id=MGPS,
         description="130-bed Medical Gas Pipeline System installation for Thkeshi Hospital, Rajkot, covering oxygen, vacuum and medical air supply.",
         completion_date="2023-03-30"),
    dict(title="250-Bed MGPS Installation", client_name="Bhagyoday Hospital", city="Kadi", service_id=MGPS,
         description="250-bed Medical Gas Pipeline System for Bhagyoday Hospital, Kadi, with fully automatic manifold and zonal alarm systems.",
         completion_date="2023-11-09"),

    # HVAC & Cleanroom
    dict(title="HVAC & Cleanroom Engineering", client_name="Nebula Company", city="Patan", service_id=HVAC,
         description="HVAC and cleanroom engineering project for Nebula Company, Patan, delivering controlled environment infrastructure.",
         completion_date="2022-07-15"),
    dict(title="HVAC & Cleanroom Engineering", client_name="Scure Company", city="Ahmedabad", service_id=HVAC,
         description="HVAC and cleanroom engineering solution for Scure Company, Ahmedabad, meeting ISO-classified environment requirements.",
         completion_date="2023-01-25"),
    dict(title="HVAC & Cleanroom Engineering", client_name="Dosani Healthcare", city="Ahmedabad", service_id=HVAC,
         description="HVAC and cleanroom engineering project for Dosani Healthcare, Ahmedabad, with dedicated air handling units per zone.",
         completion_date="2023-09-02"),

    # Clean Room Solutions
    dict(title="Clean Room Solution", client_name="Aamena Khatun Hospital", city="Ahmedabad", service_id=CLEANROOM,
         description="Turnkey Clean Room Solution for Aamena Khatun Hospital, Ahmedabad — jointless wall and ceiling panels with coved corners.",
         completion_date="2022-04-08"),
    dict(title="Clean Room Solution", client_name="Aashvi ENT Hospital", city="Ahmedabad", service_id=CLEANROOM,
         description="Clean Room Solution for Aashvi ENT Hospital, Ahmedabad, delivering an ISO-classified infection-controlled environment.",
         completion_date="2023-05-19"),
    dict(title="Clean Room Solution", client_name="Amrut Hospital", city="Bharuch", service_id=CLEANROOM,
         description="Clean Room Solution installed at Amrut Hospital, Bharuch, with non-porous seamless surfaces throughout.",
         completion_date="2023-10-13"),

    # Laminar Air Flow Systems
    dict(title="Laminar Air Flow System", client_name="Aanand Hospital", city="Ahmedabad", service_id=LAF,
         description="Laminar Air Flow system installed at Aanand Hospital, Ahmedabad, providing HEPA-filtered unidirectional airflow over the surgical table.",
         completion_date="2022-06-27"),
    dict(title="Laminar Air Flow System", client_name="Aayush Hospital", city="Jamnagar", service_id=LAF,
         description="Laminar Air Flow system for Aayush Hospital, Jamnagar, delivering a Class 100/ISO 5 sterile zone over the OT table.",
         completion_date="2023-07-31"),

    # Modular ICU Solutions
    dict(title="Modular ICU Solution", client_name="Kim's Hospital", city="Bopal", service_id=ICU,
         description="Modular ICU Solution delivered for Kim's Hospital, Bopal, with integrated MGPS bed head panels and infection-control wall systems.",
         completion_date="2022-08-19"),
    dict(title="Modular ICU Solution", client_name="Tristar Hospital", city="Junagadh", service_id=ICU,
         description="Modular ICU Solution for Tristar Hospital, Junagadh, engineered to ISO 7/Class 10,000 standards.",
         completion_date="2023-02-24"),
    dict(title="Modular ICU Solution", client_name="Pms Medical College & Hospital", city="Kalol", service_id=ICU,
         description="Modular ICU Solution installed at PMS Medical College & Hospital, Kalol, with dedicated HVAC and anti-microbial finishes.",
         completion_date="2023-12-06"),

    # Modular NICU Solutions
    dict(title="Modular NICU Solution", client_name="Nice Children Hospital", city="Viramgam", service_id=NICU,
         description="Modular NICU Solution for Nice Children Hospital, Viramgam, with individual bay gas services and low-glare clinical lighting.",
         completion_date="2022-11-14"),
    dict(title="Modular NICU Solution", client_name="Shree Lallubhai Aarogya Mandir", city="Savarkundla", service_id=NICU,
         description="Modular NICU Solution installed at Shree Lallubhai Aarogya Mandir, Savarkundla, with low-turbulence HVAC for neonatal care.",
         completion_date="2023-04-03"),

    # IVF Lab Setup
    dict(title="IVF Lab Setup", client_name="Sadbhavana Hospital", city="Kalsar", service_id=IVF,
         description="IVF Lab Setup for Sadbhavana Hospital, Kalsar, built to ISO Class 5 cleanroom standards with VOC-free materials.",
         completion_date="2023-01-09"),
    dict(title="IVF Lab Setup", client_name="Upasna Hospital", city="Surendranagar", service_id=IVF,
         description="IVF Lab Setup for Upasna Hospital, Surendranagar, with dedicated HEPA-filtered HVAC and gas supply for embryology.",
         completion_date="2023-08-28"),
]


def slugify(text):
    import re
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


# ── Delete all existing projects ────────────────────────────────────────────
existing = requests.get(f"{BASE}/admin/projects", headers=headers).json()
print(f"Existing projects: {len(existing)}")
for p in existing:
    resp = requests.delete(f"{BASE}/admin/projects/{p['id']}", headers=headers)
    if resp.status_code not in (200, 204):
        print(f"  FAIL delete {p['id']} -- {resp.status_code} {resp.text}")
print("Deleted all existing projects.")

# ── Insert new projects ─────────────────────────────────────────────────────
ok = fail = 0
for i, p in enumerate(PROJECTS, start=1):
    slug = f"{slugify(p['title'])}-{slugify(p['client_name'])}"
    payload = {
        "title": p["title"],
        "slug": slug,
        "client_name": p["client_name"],
        "city": p["city"],
        "state": "Gujarat",
        "service_id": p["service_id"],
        "description": p["description"],
        "completion_date": p["completion_date"],
        "is_featured": False,
        "is_active": True,
        "order_index": i,
    }
    resp = requests.post(f"{BASE}/admin/projects", json=payload, headers=headers)
    if resp.status_code == 201:
        ok += 1
    else:
        fail += 1
        print(f"  FAIL create '{p['title']}' / '{p['client_name']}' -- {resp.status_code} {resp.text}")

print(f"\nCreated: {ok}  |  Failed: {fail}")
