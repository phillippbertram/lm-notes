from fastapi import FastAPI, Request, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import asyncio
import tempfile
from pathlib import Path
from uuid import uuid4
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from datetime import datetime
from app.rag_agent import create_rag_agent

load_dotenv()

app = FastAPI()

# Enable CORS for local testing (optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pinecone_index = os.getenv("PINECONE_INDEX", "lmnotes-index")
embeddings = OpenAIEmbeddings()


# Dummy streaming generator (for /chat-stream)
async def dummy_token_stream(message: str):
    for word in message.split():
        await asyncio.sleep(0.2)
        yield f"data: {word} \n\n".encode("utf-8")  # 🔁 wichtig: bytes, nicht str


@app.post("/chat-stream")
async def chat_stream(request: Request):
    body = await request.json()
    input_text = body.get("message", "")
    notebookId = body.get("notebookId", "")
    print(f"input_text: {input_text}")
    print(f"notebookId: {notebookId}")
    async def event_stream():
        async for chunk in dummy_token_stream(input_text):
            yield chunk

    # agent = create_rag_agent(notebookId)
    # async def event_stream():
    #     async for event in agent.astream_events(input_text):
    #         kind = event["event"]
    #         if kind == "on_chat_model_stream":
    #             #print(event['data']['chunk'].content, end="|", flush=True)
    #             # Need to format as SSE data
    #             yield f"data: {event['data']['chunk'].content}\n\n"


    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    notebookId = body.get("notebookId", "")
    
    print(f"notebookId: {notebookId}")
    print(f"messages: {messages}")

    print(f"latest_message: {messages[-1]}")
    latest_message = messages[-1].get("content")[-1].get("text")
    print(f"latest_message: {latest_message}")

    agent = create_rag_agent(notebookId)
    response = agent.invoke(latest_message)

    return {
        "text": response
    }


# Basic PDF upload endpoint
@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    notebookId: str = Form(...),
    sourceId: str = Form(...)
):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    if not sourceId or not notebookId:
        raise HTTPException(status_code=400, detail="sourceId and notebookId are required")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    # Use LangChain's PyMuPDFLoader to load and split the document
    loader = PyMuPDFLoader(tmp_path)
    documents = loader.load()
    print(f"Loaded {len(documents)} documents")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = text_splitter.split_documents(documents)    
    
    Path(tmp_path).unlink() # delete the temp file

    # add custom metadata to the documents
    for i, doc in enumerate(split_docs):
        # update "source" to just reflect the file name
        # per default source is something like: /var/folders/hx/sm1_xfpn2tg0j6tdkkry38480000gn/T/tmp78vwjbq8.pdf
        doc.metadata.update({
            # ############################################################
            # MUST_HAVE!
            "source": file.filename,
            "sourceId": sourceId,
            "notebookId": notebookId,
            # ############################################################
            "uploadDate": datetime.now().isoformat(),
        })

        # remove file_path from metadata, because it's only temporary file
        doc.metadata.pop("file_path", None)

    print(f"Uploading to Pinecone: {pinecone_index}")
    
    # Split docs into batches
    BATCH_SIZE = 100
    total_batches = (len(split_docs) + BATCH_SIZE - 1) // BATCH_SIZE  # Ceiling division
    for i in range(0, len(split_docs), BATCH_SIZE):
        batch = split_docs[i : i + BATCH_SIZE]
        print(f"Adding batch {i//BATCH_SIZE + 1} of {total_batches}")
        PineconeVectorStore.from_documents(
            batch, embeddings, index_name=pinecone_index
        )
    print("Successfully uploaded documents to Pinecone")

    # Store uploaded file name for debug/demo purposes
    filename = Path(tmp_path).name
    return JSONResponse({
        "status": "uploaded", 
        "filename": filename,
        "sourceId": sourceId,
        "notebookId": notebookId
    })


@app.delete("/documents/notebooks/{notebookId}")
async def delete_all_documents_for_notebook(notebookId: str):
    try:
        print(f"Deleting all documents from notebook '{notebookId}' in index: {pinecone_index}")
        
        # Initialize vector store
        vector_store = PineconeVectorStore(
            index_name=pinecone_index,
            embedding=embeddings
        )
        
        # Delete all documents with matching notebookId
        vector_store.delete(
            filter={
                "notebookId": notebookId
            }
        )

        print(f"Successfully deleted all documents from notebook: {notebookId}")
        return JSONResponse({
            "status": "success",
            "message": f"Deleted all documents from notebook: {notebookId}"
        })
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting all documents: {str(e)}"
        )

@app.delete("/documents")
async def delete_all_documents():
    try:
        print(f"Deleting all documents from index: {pinecone_index}")
        
        # Initialize vector store
        vector_store = PineconeVectorStore(
            index_name=pinecone_index,
            embedding=embeddings
        )
        
        # Delete all documents without any filter
        vector_store.delete(delete_all=True)
        
        print("Successfully deleted all documents from index")
        return JSONResponse({
            "status": "success",
            "message": "Deleted all documents from index"
        })
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting all documents: {str(e)}"
        )


@app.delete("/documents/sources/{sourceId}")
async def delete_documents(sourceId: str):
    try:
        print(f"Deleting documents from source '{sourceId}' in index: {pinecone_index}")
        
        # Initialize vector store
        vector_store = PineconeVectorStore(
            index_name=pinecone_index,
            embedding=embeddings
        )
        
        # Delete all documents with matching source
        vector_store.delete(
            filter={
                "sourceId": sourceId
            }
        )
        
        print(f"Successfully deleted documents from source: {sourceId}")
        return JSONResponse({
            "status": "success",
            "message": f"Deleted all documents from source: {sourceId}"
        })
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting documents: {str(e)}"
        )


@app.get("/")
async def root():
    return {"message": "Hello From LMNotes API 👋"}
