from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
import tempfile
from pathlib import Path

app = FastAPI()

# Enable CORS for local testing (optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy streaming generator (for /chat-stream)
async def dummy_token_stream(message: str):
    for word in message.split():
        await asyncio.sleep(0.2)
        yield word + " "

@app.post("/chat-stream")
async def chat_stream(request: Request):
    body = await request.json()
    input_text = body.get("message", "")

    async def event_stream():
        async for token in dummy_token_stream(input_text):
            yield f"data: {token}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# Basic PDF upload endpoint
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Store uploaded file name for debug/demo purposes
    filename = Path(tmp_path).name
    return JSONResponse({"status": "received", "filename": filename})

@app.get("/")
async def root():
    return {"message": "Hello From LMNotes API 👋"}
