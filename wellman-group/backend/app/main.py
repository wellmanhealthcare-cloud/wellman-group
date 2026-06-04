from fastapi import FastAPI
from app.core.cors import setup_cors

app = FastAPI(
    title="Wellman Group API",
    description="Complete CMS for Wellman Group medical facilities",
    version="0.1.0",
)

# Setup CORS
app = setup_cors(app)


@app.get("/health")
def health():
    return {"status": "ok"}
