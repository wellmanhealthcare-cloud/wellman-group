# -*- coding: utf-8 -*-
"""Parse Excel files and seed unique clients via API."""
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import openpyxl
import requests

BASE = "http://localhost:8000/v1"

# Login
r = requests.post(f"{BASE}/auth/login", json={"email": "admin@wellmangroup.in", "password": "Kar@2005"})
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in.")

# Raw clients from MOT Clients LIST (most structured — has city + state columns)
raw = [
    # (hospital_name, city, state)
    ("Shantaben Gajera Trust Hospital", "Amreli", "Gujarat"),
    ("Shaligram Multispeciality Hospital", "Jamnagar", "Gujarat"),
    ("Soul Hospital", "Bhavnagar", "Gujarat"),
    ("Cancare Hospital", "Ahmedabad", "Gujarat"),
    ("Suchak Hospital", "Bhavnagar", "Gujarat"),
    ("Sidhdhivinayak Hospital", "Surendranagar", "Gujarat"),
    ("Medico Hospital", "Surendranagar", "Gujarat"),
    ("KD Hospital", "Ahmedabad", "Gujarat"),
    ("Thakershi Hospital", "Ahmedabad", "Gujarat"),
    ("Vedanta Hospital", "Mahuva", "Gujarat"),
    ("Upasana Hospital", "Surendranagar", "Gujarat"),
    ("Shivalik Hospital", "Bhavnagar", "Gujarat"),
    ("Aayush Multispeciality Hospital", "Morbi", "Gujarat"),
    ("OM Hospital", "Morbi", "Gujarat"),
    ("Shivanand Eye Hospital", "Virnagar", "Gujarat"),
    ("SMT C.U. Shah Hospital", "Surendranagar", "Gujarat"),
    ("Lallubhai Seth Hospital", "Savarkundla", "Gujarat"),
    ("Maharshi Hospital", "Surendranagar", "Gujarat"),
    ("Sava Ayush Multispeciality Hospital", "Surendranagar", "Gujarat"),
    ("Aashwi ENT Hospital", "Ahmedabad", "Gujarat"),
    ("Amena Khatun Hospital", "Ahmedabad", "Gujarat"),
    ("Balaji Women's Hospital", "Ahmedabad", "Gujarat"),
    ("City Plus Hospital", "Ahmedabad", "Gujarat"),
    ("JP Hospital", "Ahmedabad", "Gujarat"),
    ("Kansara Hospital", "Ahmedabad", "Gujarat"),
    ("OM Orthopedic Hospital", "Ahmedabad", "Gujarat"),
    ("MK Shah Medical College", "Ahmedabad", "Gujarat"),
    ("Phoenix ICU and Hospital", "Ahmedabad", "Gujarat"),
    ("Science Accolade", "Ahmedabad", "Gujarat"),
    ("Sushrushah Hospital", "Ahmedabad", "Gujarat"),
    ("Svayambhu Hospital", "Ahmedabad", "Gujarat"),
    ("Iris Hospital", "Anand", "Gujarat"),
    ("Navjeevan Multispeciality Hospital", "Ankleshwar", "Gujarat"),
    ("Sargam Multispeciality Hospital", "Ankleshwar", "Gujarat"),
    ("Shrimati Jayaben Mody Hospital", "Ankleshwar", "Gujarat"),
    ("Rudraksh Hospital", "Bareja", "Gujarat"),
    ("Apex Multispeciality Hospital", "Bharuch", "Gujarat"),
    ("Care & Cure Hospital", "Bharuch", "Gujarat"),
    ("Sevashram Hospital", "Bharuch", "Gujarat"),
    ("Omsairam Cardiac Hospital", "Bardoli", "Gujarat"),
    ("Shreeji Hospital", "Bodeli", "Gujarat"),
    ("Mother Care Hospital", "Dahod", "Gujarat"),
    ("New Hope Hospital", "Dahod", "Gujarat"),
    ("Nu Hop IVF", "Dahod", "Gujarat"),
    ("Shreeji Multispeciality Hospital", "Dhangdhra", "Gujarat"),
    ("Al Mohamad Hospital", "Jambusar", "Gujarat"),
    ("Oswal Aayush Multispeciality Hospital", "Jamnagar", "Gujarat"),
    ("Bhagyoday General Hospital", "Kadi", "Gujarat"),
    ("Rhythem Hospital", "Kadi", "Gujarat"),
    ("Soham Hospital", "Kadi", "Gujarat"),
    ("Charotar Hospital", "Kheda", "Gujarat"),
    ("Holistic General Hospital", "Mehsana", "Gujarat"),
    ("Nutan Medical College and Hospital", "Visnagar", "Gujarat"),
    ("Shrushti IVF", "Mehsana", "Gujarat"),
    ("Kidney Care Hospital", "Mehsana", "Gujarat"),
    ("Ghanchi General Hospital", "Modasa", "Gujarat"),
    ("Smt. Maroliya Hospital", "Navsari", "Gujarat"),
    ("Santram Eye Trust Hospital", "Nadiad", "Gujarat"),
    ("Kimaya Heart Hospital", "Palanpur", "Gujarat"),
    ("Medipolis Lifecare Hospital", "Palanpur", "Gujarat"),
    ("Satya Sai Hospital", "Rajkot", "Gujarat"),
    ("Karvy Therapeutics", "Rajkot", "Gujarat"),
    ("Muni Seva Charitable Trust Hospital", "Sanand", "Gujarat"),
    ("ASG Eye Hospital", "Surat", "Gujarat"),
    ("Bliss IVF", "Surat", "Gujarat"),
    ("Candor IVF", "Surat", "Gujarat"),
    ("Deep Eye Hospital", "Surat", "Gujarat"),
    ("Param Hospital", "Surat", "Gujarat"),
    ("SIMS Hospital", "Surat", "Gujarat"),
    ("Metas Adventist Mission Hospital", "Surat", "Gujarat"),
    ("Prega IVF", "Surat", "Gujarat"),
    ("Sudeep Hospital", "Surat", "Gujarat"),
    ("Surat Diamond Hospital", "Surat", "Gujarat"),
    ("Tristar Hospital", "Surat", "Gujarat"),
    ("Rugved Hospital", "Surat", "Gujarat"),
    ("Yogi Hospital", "Surat", "Gujarat"),
    ("Jayabaa Hospital", "Surat", "Gujarat"),
    ("Nakshtra IVF", "Surat", "Gujarat"),
    ("Grace IVF", "Surat", "Gujarat"),
    ("Torrent Hospital", "Surat", "Gujarat"),
    ("Maliba Hospital", "Surat", "Gujarat"),
    ("Dr. Vadhwan Hospital", "Vadhwan", "Gujarat"),
    ("Vasant Prabha Hospital", "Vadnagar", "Gujarat"),
    ("Gujarat Surgical Hospital", "Vadodara", "Gujarat"),
    ("Ashray Hospital", "Vadodara", "Gujarat"),
    ("Coral Hospital", "Vadodara", "Gujarat"),
    ("ITM SLS University Hospital", "Vadodara", "Gujarat"),
    ("Priyal Clinic IVF Center", "Vadodara", "Gujarat"),
    ("Samnvay Multispeciality Hospital", "Vadodara", "Gujarat"),
    ("Sunshine Global Hospital", "Vadodara", "Gujarat"),
    ("Rhythm Heart Hospital", "Banswara", "Rajasthan"),
    ("Jeevandeep Hospital", "Vapi", "Gujarat"),
    ("Lions Club Hospital", "Viramgam", "Gujarat"),
    ("Shiv Hospital", "Viramgam", "Gujarat"),
    ("Jivan Yog Nursing Home", "Visnagar", "Gujarat"),
    ("Swami Vivekanand Hospital", "Nasik", "Maharashtra"),
    ("Sorath Healthcare", "Junagadh", "Gujarat"),
    ("Rajkot Aayush Hospital", "Rajkot", "Gujarat"),
    ("Trimurti Hospital", "Bavla", "Gujarat"),
    ("Hridyam Heart Hospital", "Himmatnagar", "Gujarat"),
    ("Patan Heart Hospital", "Patan", "Gujarat"),
    ("Red Cross Hospital", "Alang", "Gujarat"),
    ("Shivalik Hospital", "Gandhinagar", "Gujarat"),
    ("Alpha Hospital", "Ahmedabad", "Gujarat"),
    ("Unity Hospital", "Botad", "Gujarat"),
    ("Sadvichar Hospital", "Ahmedabad", "Gujarat"),
    ("Lakshmi Hospital", "Ahmedabad", "Gujarat"),
    ("Vrajshree Hospital", "Ahmedabad", "Gujarat"),
    ("Shushrut Hospital", "Ahmedabad", "Gujarat"),
    ("Tulsi Hospital", "Ahmedabad", "Gujarat"),
    ("Shreemay Spinecare", "Ahmedabad", "Gujarat"),
    ("Madhuram Hospital", "Ahmedabad", "Gujarat"),
    ("Rathi Ortho Hospital", "Ahmedabad", "Gujarat"),
    ("SFGG Hospital", "Vatrak", "Gujarat"),
    ("Amrit Hospital", "Bharuch", "Gujarat"),
    ("Sadbhavna Hospital", "Surat", "Gujarat"),
    ("Shailesh Surgical Hospital", "Ahmedabad", "Gujarat"),
    ("Aanand Hospital", "Ahmedabad", "Gujarat"),
    ("HCG Cancer Hospital", "Ahmedabad", "Gujarat"),
    ("LG Hospital", "Ahmedabad", "Gujarat"),
    ("Starlit Cancer Hospital", "Ahmedabad", "Gujarat"),
    ("ASG Eye Hospital", "Ahmedabad", "Gujarat"),
    ("Bharat Hospital", "Mehsana", "Gujarat"),
    ("Bhagyoday Charitable Trust Hospital", "Kadi", "Gujarat"),
]

# Deduplicate by (hospital_name.lower, city.lower)
seen = set()
unique = []
for name, city, state in raw:
    key = (name.strip().lower(), city.strip().lower())
    if key not in seen:
        seen.add(key)
        unique.append((name.strip(), city.strip(), state.strip()))

print(f"\nSeeding {len(unique)} unique clients...")
ok = fail = skip = 0
for i, (name, city, state) in enumerate(unique):
    payload = {
        "hospital_name": name,
        "city": city,
        "state": state,
        "logo_url": "",
        "order_index": i + 1,
        "is_active": True,
    }
    r = requests.post(f"{BASE}/admin/clients", json=payload, headers=headers)
    if r.status_code in (200, 201):
        ok += 1
    elif r.status_code == 400 or "unique" in r.text.lower() or "already" in r.text.lower():
        skip += 1
    else:
        fail += 1
        print(f"  FAIL [{r.status_code}] {name}, {city} — {r.text[:80]}")

print(f"\nDone. Inserted: {ok}  |  Skipped (duplicate): {skip}  |  Failed: {fail}")
