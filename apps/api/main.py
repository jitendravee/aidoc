# apps/api/main.py
from dotenv import load_dotenv
load_dotenv(".env.local")  # must run before any module reads env vars

from fastapi import FastAPI
from apps.api.routers import documents, messages

app = FastAPI(title="AI PDF Editor")

app.include_router(documents.router, tags=["documents"])
app.include_router(messages.router, tags=["messages"])

@app.get("/health")
def health():
    return {"status": "ok"}