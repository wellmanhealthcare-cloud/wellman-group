import os
import re
import json
from tqdm import tqdm

INPUT_FOLDER = "../data/extracted_cleaned"
OUTPUT_FILE = "../data/chunks/chunks.json"

# Headings pattern
HEADING_PATTERN = r'^[A-Z][A-Z\s&\-\./()]+$'


def detect_category(title):

    title = title.lower()

    if "nabh" in title or "iso" in title:
        return "standards"

    elif "mgps" in title or "medical gas" in title:
        return "mgps"

    elif "floor" in title:
        return "flooring"

    elif "panel" in title:
        return "panels"

    elif "comparison" in title:
        return "comparison"

    elif "client" in title:
        return "clients"

    elif "mission" in title or "vision" in title:
        return "company_info"

    elif "about" in title:
        return "company_info"

    else:
        return "general"


def extract_chunks(text, source_file):

    lines = text.split("\n")

    chunks = []

    current_heading = "Introduction"
    parent_heading = ""
    current_content = []

    current_page = 1

    for line in lines:

        line = line.strip()

        if not line:
            continue

        # Detect page
        page_match = re.search(r'===== PAGE (\d+) =====', line)

        if page_match:
            current_page = int(page_match.group(1))
            continue

        # Detect heading
        if re.match(HEADING_PATTERN, line) and len(line) < 80:

    # Save previous chunk
            if current_content:

                chunk_text = "\n".join(current_content)

                chunks.append({
                    "title": current_heading,
                    "category": detect_category(current_heading),
                    "content": chunk_text,
                    "source": source_file,
                    "page": current_page
                })

            heading = line.strip()

            # Handle generic headings
            generic_headings = [
                "MERITS",
                "DEMERITS",
                "FEATURES",
                "SPECIFICATIONS"
            ]

            if heading in generic_headings and parent_heading:

                current_heading = f"{parent_heading} - {heading}"

            else:

                current_heading = heading

                # Update parent heading
                parent_heading = heading

            current_content = []

        else:
            current_content.append(line)

    # Final chunk
    if current_content:

        chunks.append({
            "title": current_heading,
            "category": detect_category(current_heading),
            "content": "\n".join(current_content),
            "source": source_file,
            "page": current_page
        })

    return chunks


def process_all_files():

    all_chunks = []

    txt_files = [f for f in os.listdir(INPUT_FOLDER) if f.endswith(".txt")]

    for txt_file in tqdm(txt_files):

        path = os.path.join(INPUT_FOLDER, txt_file)

        with open(path, "r", encoding="utf-8") as f:
            text = f.read()

        chunks = extract_chunks(text, txt_file)

        all_chunks.extend(chunks)
    # Add glossary chunk    
    all_chunks.append({
    "title": "Glossary",
    "category": "definitions",
    "content": """
HPL = High Pressure Laminate
ACP = Aluminium Composite Panel
MGPS = Medical Gas Pipeline System
OT = Operation Theatre
NABH = National Accreditation Board for Hospitals & Healthcare Providers
""".strip(),
    "source": "glossary",
    "page": 0
})

    # Save JSON
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=4)

    print(f"\nTotal Chunks Created: {len(all_chunks)}")


if __name__ == "__main__":
    process_all_files()