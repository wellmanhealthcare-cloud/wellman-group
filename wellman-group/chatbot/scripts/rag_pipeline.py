import json
import os
import uuid
from collections import OrderedDict

try:
    import faiss
    FAISS_AVAILABLE = True
except Exception:
    faiss = None
    FAISS_AVAILABLE = False

import numpy as np
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, CrossEncoder
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

# ==========================
# PATHS (relative to scripts/ dir, set as cwd by app.py)
# ==========================

FAISS_INDEX_PATH = "../data/embeddings/faiss_index.index"
METADATA_PATH    = "../data/embeddings/metadata.json"

RETRIEVAL_TOP_K = 20   # fetch more from FAISS, then rerank
RERANK_TOP_N    = 5    # keep best N after cross-encoder
MAX_DISTANCE_THRESHOLD = 1.2
MAX_SESSIONS = 100

# ==========================
# MODELS
# ==========================

print("[RAG] Loading embedding model…")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

print("[RAG] Loading cross-encoder reranker…")
cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# ==========================
# FAISS + METADATA
# ==========================

if FAISS_AVAILABLE:
    try:
        index = faiss.read_index(FAISS_INDEX_PATH)
        print(f"[RAG] FAISS index loaded ({index.ntotal} vectors)")
    except Exception as e:
        print(f"[RAG] FAISS load failed: {e}")
        index = None
        FAISS_AVAILABLE = False
else:
    index = None

with open(METADATA_PATH, "r", encoding="utf-8") as f:
    metadata = json.load(f)
print(f"[RAG] Metadata loaded ({len(metadata)} chunks)")

# ==========================
# LLM — Groq (free, 14,400 req/day)
# ==========================

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.1,
    max_tokens=1024,
    groq_api_key=os.getenv("GROQ_API_KEY"),
)
print("[RAG] Groq LLM ready")

# ==========================
# PROMPT
# ==========================

prompt = PromptTemplate(
    input_variables=["chat_history", "context", "question"],
    template="""You are Wellman Group's AI Assistant — a helpful expert on hospital infrastructure, modular OTs, MGPS, and Wellman's products and services.

Answer the question clearly and completely based on the context provided. Be natural and conversational — like a knowledgeable sales consultant answering a client.

Rules:
- Give a complete, helpful answer. Use bullet points or short paragraphs when listing multiple items.
- Do NOT include any source citations, page numbers, or reference tags in your answer.
- Do NOT use phrases like "(inferred)" or "[TITLE pN]" — just answer naturally.
- If the context does not contain enough information, say so politely and offer to help with something else.
- Refuse only if completely unrelated to hospital infrastructure or Wellman's business.

Conversation History:
{chat_history}

Context:
{context}

Question: {question}

Answer:"""
)

chain = prompt | llm | StrOutputParser()

# ==========================
# PER-SESSION CHAT HISTORY
# ==========================

# OrderedDict so we can evict oldest sessions (LRU-style)
_chat_histories: OrderedDict = OrderedDict()


def _get_history(session_id: str) -> list:
    return _chat_histories.get(session_id, [])


def _add_to_history(session_id: str, user: str, assistant: str):
    if session_id not in _chat_histories:
        if len(_chat_histories) >= MAX_SESSIONS:
            _chat_histories.popitem(last=False)
        _chat_histories[session_id] = []
    history = _chat_histories[session_id]
    history.append({"user": user, "assistant": assistant})
    if len(history) > 6:
        _chat_histories[session_id] = history[-6:]


def _build_history_str(session_id: str) -> str:
    lines = []
    for msg in _get_history(session_id):
        lines.append(f"User: {msg['user']}\nAssistant: {msg['assistant']}")
    return "\n\n".join(lines)


# ==========================
# DOMAIN DETECTION
# ==========================

DOMAIN_KEYWORDS = [
    "ot", "operation theatre", "operating theatre", "modular",
    "mgps", "medical gas", "hospital", "icu", "clean room",
    "nabh", "hpl", "acp", "corian", "vinyl", "epoxy",
    "panel", "flooring", "wall", "ceiling", "wellman",
    "laminate", "puf", "polyurethane", "cladding", "screed",
    "hvac", "hepa", "sterilization", "autoclave", "antistatic",
    "silicon", "aluminium", "composite", "insulation", "partition",
    "pipe", "copper", "oxygen", "manifold", "nrv", "valve",
    "service", "project", "certificate", "client",
]

OUT_OF_DOMAIN_KEYWORDS = [
    "machine learning", "artificial intelligence", "deep learning",
    "python tutorial", "javascript", "recipe", "movie", "cricket",
    "stock market", "weather", "sports",
]

FOLLOWUP_WORDS = [
    "it", "its", "it's", "this", "that", "these", "those",
    "they", "them", "their", "same", "above", "mentioned",
    "advantage", "advantages", "disadvantage", "disadvantages",
    "benefit", "benefits", "lifespan", "cost", "price",
    "specification", "specifications", "merit", "merits",
    "demerit", "demerits", "difference", "compare", "vs",
    "tell me more", "elaborate", "explain more", "what about",
]


def _is_domain(q: str) -> bool:
    ql = q.lower()
    return any(kw in ql for kw in DOMAIN_KEYWORDS)


def _is_out_of_domain(q: str) -> bool:
    ql = q.lower()
    return any(kw in ql for kw in OUT_OF_DOMAIN_KEYWORDS)


def _is_followup(q: str) -> bool:
    ql = q.lower()
    return any(w in ql for w in FOLLOWUP_WORDS)


# ==========================
# JUNK CHUNK FILTER
# ==========================

_JUNK_PREFIXES = ("Add.", "Mob.", "E-mail", "Tel.", "Fax", "THANKS")


def _is_junk_chunk(chunk: dict) -> bool:
    """Return True for chunks that are mostly address/contact boilerplate."""
    content = chunk.get("content", "")
    lines = [l.strip() for l in content.split("\n") if l.strip()]
    if not lines:
        return True
    junk = sum(1 for l in lines if any(l.startswith(p) for p in _JUNK_PREFIXES))
    return junk / len(lines) > 0.4


# ==========================
# RETRIEVAL + RERANKING
# ==========================

def _retrieve(query: str):
    if not FAISS_AVAILABLE or index is None:
        return [], False

    q_emb = embedding_model.encode([query])
    distances, indices = index.search(np.array(q_emb), RETRIEVAL_TOP_K)

    chunks, has_good = [], False
    print("\nFAISS RETRIEVAL")
    print("-" * 60)
    for dist, idx in zip(distances[0], indices[0]):
        if idx >= len(metadata):
            continue
        chunk = metadata[idx]
        if len(chunk["content"].strip()) < 20:
            continue
        if _is_junk_chunk(chunk):
            print(f"  [JUNK]  dist={dist:.4f}  [{chunk['title']} p{chunk['page']}]")
            continue
        print(f"  dist={dist:.4f}  [{chunk['title']} p{chunk['page']}]")
        chunks.append(chunk)
        if dist <= MAX_DISTANCE_THRESHOLD:
            has_good = True

    return chunks, has_good


def _rerank(query: str, chunks: list) -> list:
    if not chunks:
        return chunks
    pairs = [(query, chunk["content"]) for chunk in chunks]
    scores = cross_encoder.predict(pairs)
    ranked = sorted(zip(scores, chunks), key=lambda x: x[0], reverse=True)

    print(f"\nCROSS-ENCODER RERANK (top {RERANK_TOP_N})")
    print("-" * 60)
    for score, chunk in ranked[:RERANK_TOP_N]:
        print(f"  score={score:.4f}  [{chunk['title']} p{chunk['page']}]")

    return [chunk for _, chunk in ranked[:RERANK_TOP_N]]


# ==========================
# CONTEXT BUILDER
# ==========================

def _build_context(chunks: list) -> str:
    parts = []
    for chunk in chunks:
        parts.append(
            f"[{chunk['title']} p{chunk['page']}]\n{chunk['content']}"
        )
    return "\n\n---\n\n".join(parts)


# ==========================
# MAIN RAG FUNCTION
# ==========================

def answer_question(question: str, session_id: str = None):
    """
    Returns (reply: str, chunks: list, session_id: str)
    session_id is created if not provided — pass it back to the caller
    so the frontend can include it in subsequent requests.
    """
    if not session_id:
        session_id = str(uuid.uuid4())

    # Hard refuse for clearly unrelated topics
    if _is_out_of_domain(question):
        return (
            "That topic is outside Wellman Group's domain. I can assist with "
            "modular OTs, MGPS systems, hospital infrastructure, flooring, "
            "wall/ceiling systems, and Wellman products.",
            [],
            session_id,
        )

    # For follow-ups, prepend last question so FAISS has enough context
    resolved = question
    history = _get_history(session_id)
    if history and _is_followup(question):
        resolved = f"{history[-1]['user']} - {question}"
        print(f"[Follow-up] resolved: {resolved}")

    # Retrieve → rerank
    candidates, has_good = _retrieve(resolved)
    top_chunks = _rerank(resolved, candidates)

    # Decide how to handle missing context
    domain = _is_domain(question) or _is_domain(resolved)
    followup = _is_followup(question)

    if not has_good and not domain and not followup and not history:
        return (
            "I am Wellman Group's AI assistant.\n\n"
            "I can help with:\n"
            "• Modular Operation Theatres\n"
            "• Medical Gas Pipeline Systems (MGPS)\n"
            "• Hospital Infrastructure & NABH\n"
            "• Flooring, Wall & Ceiling Systems\n"
            "• Wellman Products & Projects\n\n"
            "Please ask a question related to these topics.",
            [],
            session_id,
        )

    context = _build_context(top_chunks) if top_chunks else "No relevant documents found."
    history_str = _build_history_str(session_id)

    answer = chain.invoke({
        "chat_history": history_str,
        "context": context,
        "question": question,
    })

    _add_to_history(session_id, question, answer)
    return answer, top_chunks, session_id


# ==========================
# CLI MODE
# ==========================

if __name__ == "__main__":
    print("\nWellman RAG Assistant Ready\n")
    sid = str(uuid.uuid4())
    while True:
        q = input("\nAsk (exit to quit): ").strip()
        if not q:
            continue
        if q.lower() == "exit":
            break
        ans, sources, _ = answer_question(q, sid)
        print("\n" + "=" * 70)
        print(ans)
        print("=" * 70)
