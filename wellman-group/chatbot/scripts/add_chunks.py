"""
Run this once to inject custom knowledge chunks into the FAISS index.
Usage: python add_chunks.py
"""
import json
import os
import sys

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

FAISS_INDEX_PATH = "../data/embeddings/faiss_index.index"
METADATA_PATH    = "../data/embeddings/metadata.json"

# ── New chunks to inject ─────────────────────────────────────────────────────
NEW_CHUNKS = [
    {
        "title": "FLOORING BRANDS",
        "category": "flooring",
        "source": "custom_knowledge",
        "page": 0,
        "content": (
            "Wellman Group uses the following vinyl flooring brands for hospitals and modular OTs:\n"
            "1. Tarkett – International brand, widely used in hospital OTs. Anti-static, seamless, glare-free vinyl flooring.\n"
            "2. Gerflor (also called Ger) – French brand, premium hospital-grade vinyl flooring. Anti-microbial, jointless/seamless.\n"
            "3. Geo – Indian brand, cost-effective vinyl flooring option for hospitals.\n"
            "All three are suitable for modular operation theatres and cleanrooms as they are non-porous, seamless, and anti-static."
        ),
    },
    {
        "title": "FLOORING COMPARISON",
        "category": "flooring",
        "source": "custom_knowledge",
        "page": 1,
        "content": (
            "Flooring options used in Wellman Group projects — comparison:\n\n"
            "1. Epoxy Flooring\n"
            "   - Lifespan: 4–5 years\n"
            "   - Cost: Low\n"
            "   - Properties: Moisture resistant, seamless, easy to clean\n"
            "   - Limitation: Not anti-static, shorter life\n\n"
            "2. Vinyl Flooring (Tarkett / Gerflor / Geo)\n"
            "   - Lifespan: 10–12 years\n"
            "   - Cost: Medium\n"
            "   - Properties: Anti-static, jointless/seamless, glare-free, recyclable, anti-microbial\n"
            "   - Best for: OT, ICU, NICU, IVF labs\n"
            "   - Brands: Tarkett (international), Gerflor (French/premium), Geo (Indian/budget)\n\n"
            "3. Marble Flooring\n"
            "   - Lifespan: 12–15 years\n"
            "   - Cost: Medium-High\n"
            "   - Properties: Durable, aesthetic\n"
            "   - Limitation: Has joints — NOT suitable for cleanroom/NABH-compliant OT (bacteria can form in joints)\n\n"
            "Recommendation: Vinyl flooring (Tarkett or Gerflor) is the best choice for NABH-compliant modular OTs "
            "as it is jointless, seamless, anti-static and meets ISO 5 / Class 100 requirements."
        ),
    },
    {
        "title": "FLOORING NABH REQUIREMENTS",
        "category": "flooring",
        "source": "custom_knowledge",
        "page": 2,
        "content": (
            "NABH requirements for OT flooring:\n"
            "- Must be non-porous (no joints or cracks where bacteria can form)\n"
            "- Jointless and seamless construction\n"
            "- No 90-degree corners (coved edges required)\n"
            "- Washable with anti-bacterial and anti-fungal properties\n"
            "- Anti-static (especially important in OT where electrical equipment is used)\n"
            "- Glare-free surface\n\n"
            "Vinyl flooring (Tarkett, Gerflor, Geo brands) meets all NABH flooring requirements.\n"
            "Epoxy flooring partially meets requirements but has a shorter lifespan.\n"
            "Marble flooring does NOT meet NABH requirements due to joints."
        ),
    },
]

# ── Main ────────────────────────────────────────────────────────────────────

def main():
    print("Loading embedding model…")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    print("Loading FAISS index…")
    index = faiss.read_index(FAISS_INDEX_PATH)
    print(f"  Current vectors: {index.ntotal}")

    print("Loading metadata…")
    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        metadata = json.load(f)
    print(f"  Current chunks: {len(metadata)}")

    # Check for duplicates (by title+page)
    existing_keys = {(c["title"], c["page"]) for c in metadata}
    to_add = [c for c in NEW_CHUNKS if (c["title"], c["page"]) not in existing_keys]

    if not to_add:
        print("All chunks already exist — nothing to add.")
        return

    print(f"\nAdding {len(to_add)} new chunk(s):")
    for c in to_add:
        print(f"  [{c['title']} p{c['page']}]")

    texts = [c["content"] for c in to_add]
    embeddings = model.encode(texts, show_progress_bar=True)
    embeddings = np.array(embeddings, dtype="float32")

    index.add(embeddings)
    metadata.extend(to_add)

    print("\nSaving updated FAISS index…")
    faiss.write_index(index, FAISS_INDEX_PATH)

    print("Saving updated metadata…")
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=4)

    print(f"\nDone! Index now has {index.ntotal} vectors, metadata has {len(metadata)} chunks.")


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
