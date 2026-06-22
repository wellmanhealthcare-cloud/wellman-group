# -*- coding: utf-8 -*-
"""
Seed product items — sourced from Wellman's own PDFs (mot.pdf, mgps.pdf, company_profile.pdf).
Deletes ALL existing product items first, then inserts the full canonical list.
"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import requests

BASE = "http://localhost:8000/v1"

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

# ── Delete all existing product items ─────────────────────────────────────────
r = requests.get(f"{BASE}/admin/product-items", headers=headers)
if r.status_code == 200:
    existing = r.json()
    print(f"Deleting {len(existing)} existing product items...")
    for item in existing:
        d = requests.delete(f"{BASE}/admin/product-items/{item['id']}", headers=headers)
        status = "OK" if d.status_code == 204 else f"FAIL ({d.status_code})"
        print(f"  {status}  {item['service_slug']} / {item['name']}")
else:
    print(f"Could not fetch existing items: {r.status_code} {r.text}")
print()

# ── Full canonical product items — all sourced from Wellman PDFs ───────────────

ITEMS = [

    # ── Modular Operation Theatre ─────────────────────────────────────────────
    # Source: mot.pdf pages 12, 18, 23–26, 35–42

    {
        "service_slug": "modular-operation-theatre",
        "name": "Modular Wall Panels (HPL / PPGI / PCGI / SS / PVC-CLADDING / GLASS)",
        "description": (
            "Pre-fabricated sandwich panels with EPS or PUF insulation core and GI steel skin on "
            "both sides. Jointless edges eliminate bacteria-harbouring gaps, meeting NABH "
            "& ISO 5 (Class 100) infection-control requirements. Available in HPL, PPGI, "
            "PCGI, SS, PVC-Cladding and Glass finish variants."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Modular Ceiling Panels (GI-GI / HPL-GI / HPL-HPL / SS-GI / SS-SS)",
        "description": (
            "Sandwich PUF ceiling panels with a choice of cladding combinations: GI-GI, HPL-GI, "
            "HPL-HPL, SS-GI or SS-SS. Walkable and non-walkable variants available. "
            "Jointless, seamless surface without 90° corners as per NABH guidelines."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Corian Panels",
        "description": (
            "6/12 mm Corian panels on aluminium framing with PTFE-sealed joints. "
            "Best-in-class — fully jointless and seamless without any 90° corners. "
            "Life: 20–25 years. Resistant to moisture, abrasion and bacteria."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Air Handling Unit (A.H.U.)",
        "description": (
            "Dedicated AHU per OT as per NABH guidelines — no Window AC or Split AC permitted. "
            "Houses 10µ pre-filters and 5µ fine-filters. Maintains >25 air changes per hour, "
            "temperature 21±3°C and humidity 40–60% RH."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "HEPA Filters (0.3 Micron)",
        "description": (
            "0.3-micron HEPA filters housed in the plenum box above the OT table. "
            "Primary component of Vertical Laminar Air Flow — delivers ISO 5 (Class 100) "
            "clean air over the surgical field, reducing bacteria by a factor of 15,000."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Plenum Box (Filter Housing)",
        "description": (
            "Filter housing installed in the OT ceiling above the operating table. "
            "Superspeciality OT: 8×6 ft; General OT: 6×4 ft. "
            "Houses HEPA filters and delivers vertical laminar airflow at 90–120 FPM."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Distribution Ducting",
        "description": (
            "Supply and return air ductwork connecting the AHU to the plenum box. "
            "Designed for balanced, pressure-controlled air distribution maintaining "
            "10–15 Pascal positive pressure inside the OT."
        ),
        "order_index": 7,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Clean Room Doors (Sliding & Hinged)",
        "description": (
            "Sliding and hinged clean room doors that maintain positive pressure inside the OT. "
            "Enables quicker and safer disinfecting, provides acoustic control "
            "and keeps contamination risks under control."
        ),
        "order_index": 8,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "OT Control Panel",
        "description": (
            "Surgeon Control Panel: Time of Day Clock, Elapsed Time Clock, Temperature Controller, "
            "Humidity Controller, Lighting Control/Dimming, Medical Gas Alarm Systems, "
            "Hands-Free Telephone, HEPA Filter Status Indicator, Laminar Flow & Pressure Indicator, "
            "Music Control."
        ),
        "order_index": 9,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Pendants (Surgical & Anaesthesia)",
        "description": (
            "Ceiling-mounted surgical and anaesthesia pendants providing a well-designed "
            "working environment with advanced surgical tools/equipment positioning "
            "and integrated supply system management."
        ),
        "order_index": 10,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Hatch Box (Pass Box)",
        "description": (
            "For transfer of materials in and out of the OT without breaking the sterile barrier. "
            "Minimises entry of contaminants. Includes Pressure Relief Damper "
            "to control room pressure during transfer."
        ),
        "order_index": 11,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Peripheral Light",
        "description": (
            "Glare-free OT peripheral lighting: 5,000 hours life, CRI >90%, "
            "Efficiency >85%, Color Temperature 6500K, Max. Surface Luminance >13,000 Lux."
        ),
        "order_index": 12,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "LED X-Ray View Box",
        "description": (
            "85% energy saving LED X-ray view box with 4–5× longer life than conventional. "
            "Film-activated switch with auto-off and 12-step digital timer."
        ),
        "order_index": 13,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "OT Flooring (Vinyl / Epoxy)",
        "description": (
            "Vinyl Flooring: seamless welded-rod joints, anti-static, glare-free, recyclable — "
            "10–12 year life. Epoxy Flooring: moisture and abrasion resistant, cost-effective — "
            "4–5 year life. Both are non-porous, washable and anti-bacterial."
        ),
        "order_index": 14,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Scrub Sink (Stainless Steel)",
        "description": (
            "Stainless steel surgical scrub sink installed in the scrub bay adjacent to the OT "
            "for pre-surgical hand scrubbing. Integrated with the modular OT structure."
        ),
        "order_index": 15,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "Storage Cabinet",
        "description": (
            "Modular stainless steel storage cabinet integrated into the OT structure "
            "for sterile instrument and supply storage within the clean room envelope."
        ),
        "order_index": 16,
        "is_active": True,
    },
    {
        "service_slug": "modular-operation-theatre",
        "name": "View Window & Writing Board",
        "description": (
            "Double-glazed observation window built into the OT wall for external viewing "
            "without breaking the sterile environment. Accompanied by a writing/communication "
            "board for case notes inside the OT."
        ),
        "order_index": 17,
        "is_active": True,
    },

    # ── Medical Gas Pipeline System ───────────────────────────────────────────
    # Source: mgps.pdf pages 6–14

    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Copper Piping (Mexflow — Medical Grade)",
        "description": (
            "Mexflow make medical-grade copper piping and elbows. "
            "BS EN 13348:2008 Certified, Lloyd Certified, carbon-free. "
            "Brazed with Harris O rods (USA Make) and nitrogen-purged during installation."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "O₂ & N₂O Manifold",
        "description": (
            "High-pressure manifold rated at 170–180 bar. Machine-pressed construction "
            "with enhanced NRV (Non-Return Valve) life and less chances of breakage. "
            "Semi-automatic and fully automatic variants — analog and digital."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Oxygen Control Panel",
        "description": (
            "Auto changeover between Bank-A and Bank-B oxygen supply with alarm system. "
            "Available in semi-automatic and fully automatic variants — "
            "both analog and digital versions supplied and installed."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Vacuum & Air Plant",
        "description": (
            "Indian and imported (Anest Iwata, Japan) make vacuum and medical air plants. "
            "Oil-base and oil-free variants available for medical vacuum and "
            "compressed medical air supply throughout the hospital."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Medical Gas Outlets",
        "description": (
            "Four international outlet types: S-Bracket (1 O-ring, single lock), "
            "Puritan-Bennet (2 O-rings, double lock), British Standard (3 O-rings, double lock), "
            "Datex-Ohmeda (4 O-rings, double lock)."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Area Alarm System",
        "description": (
            "Zone-level gas pressure alarm panels (digital and analog) installed at each "
            "clinical area — OT, ICU, Ward — providing real-time audible and visual alerts "
            "for low pressure or fault conditions in the medical gas supply."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Zonal Valve Box",
        "description": (
            "Zone isolation valve boxes installed at department entry points. "
            "Allows individual wards or OTs to be shut off for maintenance "
            "without interrupting gas supply to the rest of the hospital."
        ),
        "order_index": 7,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Bed Head Panel",
        "description": (
            "Wall-mounted panels at each patient bay integrating medical gas outlets "
            "(O₂, Air, Vacuum, N₂O), electrical sockets and nurse call points — "
            "for wards, HDUs and ICUs."
        ),
        "order_index": 8,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Ward Vacuum Unit",
        "description": (
            "Bedside suction unit for ward-level medical vacuum delivery. "
            "Connected to the central vacuum plant via the MGPS pipeline."
        ),
        "order_index": 9,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "BPC Flowmeter",
        "description": (
            "Precision flowmeter for measuring and controlling the flow of medical gases "
            "such as Oxygen and Nitrous Oxide at the point of care."
        ),
        "order_index": 10,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "OT Suction Trolley",
        "description": (
            "Mobile suction trolley for OT use, connected to the central vacuum pipeline. "
            "Provides flexible positioning of suction at the surgical field."
        ),
        "order_index": 11,
        "is_active": True,
    },
    {
        "service_slug": "medical-gas-pipeline-system",
        "name": "Harris O Brazing Rod (USA)",
        "description": (
            "Premium USA-make Harris O brazing rods used for all copper pipe joints. "
            "Ensures leak-free, medically-safe joints that comply with "
            "BS EN 13348:2008 installation standards."
        ),
        "order_index": 12,
        "is_active": True,
    },

    # ── HVAC & Cleanroom Engineering ──────────────────────────────────────────
    # Source: company_profile.pdf page 7, mot.pdf pages 10–12

    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "Air Handling Unit (AHU)",
        "description": (
            "Dedicated AHU per OT zone as per NABH requirements — no Window AC or Split AC "
            "in critical clinical areas. Houses pre-filters (10µ) and fine-filters (5µ) "
            "to supply conditioned, filtered air to HEPA terminal units."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "HEPA Filters (0.3 Micron / H14)",
        "description": (
            "Terminal HEPA filters (H14 grade, 0.3 micron) at supply air points achieving "
            "ISO 5 to ISO 8 cleanliness classes. Filtration efficiency: removes 99.97%+ "
            "of airborne particulates."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "Distribution Ducting",
        "description": (
            "Supply and return air ductwork network engineered for balanced pressure-controlled "
            "air distribution across all clean zones — OT, ICU, NICU, CSSD and cleanrooms."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "Modular Wall Panels (PUF Sandwich)",
        "description": (
            "Anti-bacterial, anti-fungal PUF sandwich panels in GI, HPL, ACP or SS cladding. "
            "Non-porous, seamless and washable — meeting NABH clean room wall requirements."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "Modular Ceiling Panels",
        "description": (
            "Walkable and non-walkable ceiling panel systems. "
            "Seamless, jointless finish with no 90° corners — prevents bacterial accumulation "
            "in joints or cracks as per NABH guidelines."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "Covings (Coved Corners)",
        "description": (
            "Radiused coving profiles fitted at all wall-floor and wall-ceiling junctions. "
            "Eliminates 90° corners — the primary bacterial accumulation point — "
            "as mandated by NABH and JCI clean room standards."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "Clean Room Doors (Sliding & Hinged)",
        "description": (
            "Pressure-sealed sliding and hinged clean room doors maintaining positive "
            "or negative pressure differentials between zones. Features acoustic control "
            "and rapid disinfection cycle compatibility."
        ),
        "order_index": 7,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "View Panels",
        "description": (
            "Double-glazed observation panels integrated into clean room walls "
            "for external viewing without compromising the sterile envelope."
        ),
        "order_index": 8,
        "is_active": True,
    },
    {
        "service_slug": "hvac-cleanroom-engineering",
        "name": "Hospital-Grade Flooring (Vinyl / Epoxy)",
        "description": (
            "Anti-static, seamless, anti-microbial vinyl or epoxy flooring. "
            "Vinyl: 10–12 year life, recyclable, glare-free. "
            "Epoxy: moisture and abrasion resistant, cost-effective."
        ),
        "order_index": 9,
        "is_active": True,
    },

    # ── Clean Room Solutions ──────────────────────────────────────────────────
    # Source: company_profile.pdf page 7

    {
        "service_slug": "clean-room-solutions",
        "name": "Wall Panels (PUF Sandwich — Multiple Cladding Options)",
        "description": (
            "GI, ACP, HPL and SS cladding variants over PUF insulation core. "
            "All options are anti-bacterial, anti-fungal, non-porous and washable. "
            "Customised to specific room class and client requirements."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "clean-room-solutions",
        "name": "Walkable Ceiling Panels",
        "description": (
            "Weight-bearing ceiling panel system allowing maintenance team access from above. "
            "Seamless, jointless surface — no 90° corners — meeting ISO 5 to ISO 8 requirements."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "clean-room-solutions",
        "name": "Non-walkable Ceiling Panels",
        "description": (
            "Standard clean room ceiling panels for areas where above-ceiling access "
            "is not required. Lightweight, seamless and easily integrated with "
            "HEPA diffusers and lighting units."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "clean-room-solutions",
        "name": "Risers",
        "description": (
            "Vertical connection profiles between wall panels and ceiling panels. "
            "Ensures a continuous, gapless envelope throughout the clean room structure."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "clean-room-solutions",
        "name": "Clean Room Doors (Sliding & Hinged)",
        "description": (
            "Pressure-maintaining clean room door systems. Sliding doors for high-traffic "
            "areas, hinged doors for utility access. Both maintain the pressure differential "
            "and particulate integrity of the clean zone."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "clean-room-solutions",
        "name": "View Panels",
        "description": (
            "Transparent observation panels installed within clean room walls. "
            "Double-glazed, sealed to maintain pressure and prevent particulate ingress."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "clean-room-solutions",
        "name": "Covings (Coved Corners)",
        "description": (
            "Radiused coving profiles at all wall-floor and wall-ceiling junctions. "
            "Eliminates bacteria-harbouring 90° corners — mandatory under NABH and JCI "
            "clean room standards."
        ),
        "order_index": 7,
        "is_active": True,
    },
    {
        "service_slug": "clean-room-solutions",
        "name": "Vinyl / Epoxy Flooring",
        "description": (
            "Seamless anti-static flooring systems compatible with all clean room classes. "
            "Vinyl: welded-rod seamless joints, anti-static, recyclable, 10–12 year life. "
            "Epoxy: high moisture resistance, cost-effective."
        ),
        "order_index": 8,
        "is_active": True,
    },

    # ── Laminar Air Flow Systems ──────────────────────────────────────────────
    # Source: mot.pdf page 12

    {
        "service_slug": "laminar-air-flow-systems",
        "name": "Air Handling Unit (A.H.U.)",
        "description": (
            "Core unit of the LAF system. Houses 10µ pre-filters and 5µ fine-filters. "
            "Conditions and delivers filtered air to the HEPA plenum, maintaining "
            ">25 air changes per hour with temperature and humidity control."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "laminar-air-flow-systems",
        "name": "Pre-filters (10µ) at AHU",
        "description": (
            "First-stage filtration at the AHU inlet. Captures coarse particulates "
            "and protects the downstream fine-filters and HEPA filters from premature loading."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "laminar-air-flow-systems",
        "name": "Fine Filters (5µ) at AHU",
        "description": (
            "Second-stage filtration at AHU outlet. Removes fine particulates before "
            "air reaches the HEPA terminal filter, extending HEPA filter life."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "laminar-air-flow-systems",
        "name": "HEPA Filters (0.3 Micron / H14)",
        "description": (
            "Terminal HEPA filters delivering vertical unidirectional (laminar) airflow "
            "at 90–120 FPM. Achieves ISO 5 / Class 100 cleanliness — reducing bacteria "
            "by a factor of 15,000."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "laminar-air-flow-systems",
        "name": "Plenum Box (Filter Housing)",
        "description": (
            "Ceiling-mounted filter housing above the critical work zone. "
            "Superspeciality: 8×6 ft; General: 6×4 ft. "
            "Houses HEPA filters and directs clean air downward in a uniform laminar pattern."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "laminar-air-flow-systems",
        "name": "Distribution Ducting",
        "description": (
            "Supply and return air ductwork connecting the AHU to the plenum box "
            "and return air grilles. Engineered to maintain correct pressure differential "
            "and air velocity across the entire clean zone."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "laminar-air-flow-systems",
        "name": "AC Unit (connected to AHU)",
        "description": (
            "Dedicated air conditioning unit supplying conditioned air to the AHU. "
            "Maintains temperature at 21±3°C and humidity at 40–60% RH "
            "as per NABH specifications for OT and critical care environments."
        ),
        "order_index": 7,
        "is_active": True,
    },

    # ── ICU Solutions ─────────────────────────────────────────────────────────

    {
        "service_slug": "modular-icu-solutions",
        "name": "Infection-control Wall Panels (Anti-microbial)",
        "description": (
            "Modular wall panels with anti-microbial, anti-fungal surface finish. "
            "Coved corners — no 90° joints — prevent bacterial accumulation. "
            "Non-porous, seamless and fully washable for ICU infection-control compliance."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "Modular Ceiling Panels",
        "description": (
            "Seamless, jointless ceiling panels with anti-bacterial surface finish. "
            "Integrated with HVAC supply grilles and lighting for a clean, "
            "easily maintainable ICU ceiling."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "MGPS Bed Head Panels (O₂ / Air / Vacuum)",
        "description": (
            "Wall-mounted gas service panels at each ICU bed providing Oxygen, "
            "Medical Air and Vacuum outlets alongside electrical sockets — "
            "integrated from Wellman's own MGPS pipeline system."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "Medical Pendant Systems",
        "description": (
            "Ceiling-mounted supply pendants at each ICU bay integrating gas, "
            "electrical and data services at the point of care. "
            "Keeps cables and tubing clear of the floor for infection control."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "Dedicated HVAC System (Positive / Negative Pressure)",
        "description": (
            "ISO 7 / Class 10,000 HVAC system with capability for positive pressure "
            "(immunocompromised patients) or negative pressure (isolation) configuration. "
            "Includes AHU, HEPA filtration and dedicated ducting per zone."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "Clean Room Doors (Sliding)",
        "description": (
            "Sliding clean room doors maintaining pressure differentials between ICU zones "
            "and corridors. Quiet operation, contamination-controlled, compatible with "
            "high-frequency traffic in critical care environments."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "Clinical Lighting",
        "description": (
            "Optimised glare-free clinical lighting per ICU bay. "
            "Provides adequate illumination for clinical assessment while reducing "
            "visual fatigue for staff and patients."
        ),
        "order_index": 7,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "Track & Curtain System",
        "description": (
            "Ceiling-mounted track and curtain system for patient bay privacy in ICU, "
            "NICU and ward areas. One of Wellman Group's core listed products alongside "
            "Modular OT and Medical Gas Pipeline System."
        ),
        "order_index": 8,
        "is_active": True,
    },
    {
        "service_slug": "modular-icu-solutions",
        "name": "Anti-microbial Vinyl Flooring",
        "description": (
            "Seamless anti-static vinyl flooring for ICU environments. "
            "Welded-rod seamless joints — no bacteria-harbouring gaps. "
            "Anti-microbial coating, easy to disinfect, 10–12 year life."
        ),
        "order_index": 9,
        "is_active": True,
    },

    # ── NICU Solutions ────────────────────────────────────────────────────────

    {
        "service_slug": "modular-nicu-solutions",
        "name": "Individual Bay Bed Head Panels",
        "description": (
            "Dedicated gas service panels per incubator bay supplying Oxygen, "
            "Medical Air and Vacuum. Configured for neonatal flow requirements — "
            "integrated from Wellman's own MGPS pipeline system."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "modular-nicu-solutions",
        "name": "Low-turbulence HVAC System",
        "description": (
            "HVAC system engineered for minimal air turbulence — critical for premature "
            "and critically ill neonates. ISO 7 / Class 10,000 with precise temperature "
            "21±3°C and humidity 40–60% RH control."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "modular-nicu-solutions",
        "name": "Anti-microbial Wall & Ceiling Panels",
        "description": (
            "Modular panels with anti-microbial, anti-fungal surface finish. "
            "Coved corners, seamless and non-porous — maintaining the sterile environment "
            "required for immunocompromised neonates."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "modular-nicu-solutions",
        "name": "Medical Pendants / Overhead Supply Units",
        "description": (
            "Per-bay overhead supply arms integrating gas outlets, electrical sockets "
            "and data points at the incubator. Keeps cables clear of walkways "
            "and facilitates easy infection control."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "modular-nicu-solutions",
        "name": "HEPA Filtration System (Positive Pressure)",
        "description": (
            "Terminal HEPA filters maintaining positive pressure throughout the NICU — "
            "protecting immunocompromised neonates from airborne infections. "
            "Achieves ISO 7 / Class 10,000 particulate cleanliness."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "modular-nicu-solutions",
        "name": "Low-glare Clinical Lighting",
        "description": (
            "Per-bay neonatal-safe lighting at controlled intensity. "
            "Low glare to protect premature neonates' developing eyes while providing "
            "adequate illumination for clinical staff."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "modular-nicu-solutions",
        "name": "Sliding Clean Room Doors",
        "description": (
            "Quiet-operation sliding clean room doors maintaining pressure differentials. "
            "Minimises noise disturbance — essential in neonatal care environments "
            "where acoustic control directly impacts patient outcomes."
        ),
        "order_index": 7,
        "is_active": True,
    },

    # ── IVF Lab Setup ─────────────────────────────────────────────────────────

    {
        "service_slug": "ivf-lab-setup",
        "name": "VOC-free Modular Wall Panels",
        "description": (
            "Zero off-gassing wall panels — every material, adhesive and finish selected "
            "for zero VOC emission. Critical for embryo viability: even trace VOCs "
            "can compromise IVF success rates."
        ),
        "order_index": 1,
        "is_active": True,
    },
    {
        "service_slug": "ivf-lab-setup",
        "name": "VOC-free Ceiling Panels",
        "description": (
            "ICMR-guideline-compliant clean room ceiling panels with zero off-gassing. "
            "Seamless, jointless — integrated with HEPA diffusers for ISO Class 5 "
            "(< 100 particles ≥ 0.5µm/ft³) particulate control."
        ),
        "order_index": 2,
        "is_active": True,
    },
    {
        "service_slug": "ivf-lab-setup",
        "name": "HEPA-filtered HVAC System",
        "description": (
            "Precision HVAC system achieving ISO Class 5 / Class 100 cleanliness. "
            "Maintains temperature at 21±1°C (tighter than standard OT), "
            "humidity 40–60% RH and effectively zero VOC levels as per ICMR guidelines."
        ),
        "order_index": 3,
        "is_active": True,
    },
    {
        "service_slug": "ivf-lab-setup",
        "name": "CO₂ Gas Supply System",
        "description": (
            "Medical-grade pipeline CO₂ supply to incubators throughout the IVF lab. "
            "Connected via Wellman's own MGPS infrastructure with zone isolation "
            "and alarm monitoring."
        ),
        "order_index": 4,
        "is_active": True,
    },
    {
        "service_slug": "ivf-lab-setup",
        "name": "N₂ Gas Supply System",
        "description": (
            "Nitrogen gas pipeline supply for liquid nitrogen storage equipment "
            "used in cryopreservation of embryos, eggs and sperm within the IVF lab."
        ),
        "order_index": 5,
        "is_active": True,
    },
    {
        "service_slug": "ivf-lab-setup",
        "name": "Laminar Air Flow Unit (Over Workstations)",
        "description": (
            "Vertical LAF units positioned over embryology workstations creating a "
            "localised ISO Class 5 sterile zone. Prevents airborne contamination "
            "during gamete and embryo handling."
        ),
        "order_index": 6,
        "is_active": True,
    },
    {
        "service_slug": "ivf-lab-setup",
        "name": "Interlocked Clean Room Door System",
        "description": (
            "Pressure-sealed interlocked door system ensuring only one door opens at a time. "
            "Maintains the positive pressure envelope of the IVF lab and prevents "
            "particulate ingress during entry/exit."
        ),
        "order_index": 7,
        "is_active": True,
    },
    {
        "service_slug": "ivf-lab-setup",
        "name": "VOC-free Vinyl Flooring",
        "description": (
            "Seamless, zero off-gassing vinyl flooring for IVF lab environments. "
            "Anti-static, easily disinfectable — selected specifically for zero VOC "
            "contribution to maintain embryo-safe air quality."
        ),
        "order_index": 8,
        "is_active": True,
    },
]

# ── Seed ──────────────────────────────────────────────────────────────────────
print(f"Seeding {len(ITEMS)} product items...\n")

added = failed = 0
current_slug = None

for item in ITEMS:
    if item["service_slug"] != current_slug:
        current_slug = item["service_slug"]
        print(f"\n── {current_slug} ──")

    resp = requests.post(f"{BASE}/admin/product-items", json=item, headers=headers)
    if resp.status_code in (200, 201):
        print(f"  OK    {item['name']}")
        added += 1
    else:
        print(f"  FAIL  {item['name']} -- {resp.status_code}: {resp.text}")
        failed += 1

print(f"\n{'─'*60}")
print(f"Done.  Added: {added}  |  Failed: {failed}")
