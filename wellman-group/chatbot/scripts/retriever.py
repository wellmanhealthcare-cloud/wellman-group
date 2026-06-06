import json
import faiss
import numpy as np

from sentence_transformers import SentenceTransformer

# Paths
FAISS_INDEX_PATH = "../data/embeddings/faiss_index.index"

METADATA_PATH = "../data/embeddings/metadata.json"

# Load model
model = SentenceTransformer('all-MiniLM-L6-v2')


# Load FAISS index
index = faiss.read_index(FAISS_INDEX_PATH)

# Load metadata
with open(METADATA_PATH, "r", encoding="utf-8") as f:
    metadata = json.load(f)


def search(query, top_k=5):

    print(f"\nQuery: {query}")

    # Convert query into embedding
    query_embedding = model.encode([query])

    # Search FAISS
    distances, indices = index.search(
        np.array(query_embedding),
        top_k
    )

    results = []

    for idx in indices[0]:

        chunk = metadata[idx]

        results.append(chunk)

    return results


if __name__ == "__main__":

    while True:

        query = input("\nAsk Question (or type exit): ")

        if query.lower() == "exit":
            break

        results = search(query)

        print("\nTop Results:\n")

        for i, chunk in enumerate(results):

            print("=" * 80)

            print(f"Result {i+1}")

            print(f"Title: {chunk['title']}")

            print(f"Category: {chunk['category']}")

            print(f"Source: {chunk['source']}")

            print(f"Page: {chunk['page']}")

            print("\nContent:\n")

            print(chunk['content'][:1000])

            print("\n")