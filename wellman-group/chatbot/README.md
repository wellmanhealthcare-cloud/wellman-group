---
title: Wellman RAG Chatbot
emoji: 🏥
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# Wellman Group — RAG Chatbot

Flask + FAISS + Groq LLM RAG service answering questions about Wellman Group's
hospital infrastructure products (modular OTs, MGPS, flooring, wall/ceiling systems).

## Endpoints
- `GET /health` — health check
- `POST /chat` — `{ "message": "...", "session_id": "..." }` → `{ "reply": "...", "session_id": "..." }`

## Required secret
Set `GROQ_API_KEY` in the Space's **Settings → Repository secrets**.
