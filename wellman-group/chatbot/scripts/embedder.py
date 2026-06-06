import json
import numpy as np
import faiss
import os

from sentence_transformers import SentenceTransformer

# Paths
CHUNKS_FILE = "../data/chunks/chunks.json"

FAISS_INDEX_PATH = "../data/embeddings/faiss_index.index"

METADATA_PATH = "../data/embeddings/metadata.json"

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')


def load_chunks():

    with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    return chunks


def create_embeddings(chunks):

    texts = []

    metadata = []

    for chunk in chunks:

        # Combine title + content
        text = f"""
        Title: {chunk['title']}
        Category: {chunk['category']}
        Source: {chunk['source']}

        Content:
        {chunk['content']}
        """

        texts.append(text)

        metadata.append(chunk)

    print("Creating embeddings...")

    embeddings = model.encode(
        texts,
        show_progress_bar=True
    )

    return embeddings, metadata


def store_faiss_index(embeddings):

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(np.array(embeddings))

    faiss.write_index(index, FAISS_INDEX_PATH)

    print(f"FAISS index saved at: {FAISS_INDEX_PATH}")


def save_metadata(metadata):

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    print(f"Metadata saved at: {METADATA_PATH}")


def main():

    chunks = load_chunks()

    print(f"Loaded {len(chunks)} chunks")

    embeddings, metadata = create_embeddings(chunks)

    store_faiss_index(embeddings)

    save_metadata(metadata)

    print("\nEmbedding pipeline completed successfully!")


if __name__ == "__main__":
    main()