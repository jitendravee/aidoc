# apps/api/main.py
from dotenv import load_dotenv
load_dotenv(".env.local")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.api.routers import documents, messages

app = FastAPI(title="AI PDF Editor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://flowaipdf.netlify.app","http://flowpdf.online/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, tags=["documents"])
app.include_router(messages.router, tags=["messages"])

@app.get("/health")
def health():
    return {"status": "ok"}