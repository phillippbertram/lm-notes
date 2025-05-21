# LMNotes API

A FastAPI-based backend service for managing and processing PDF documents with AI-powered search capabilities.

## Features

- PDF document upload and processing
- Document chunking and embedding generation
- Vector storage using Pinecone
- Document management (upload, delete by source/notebook)
- Streaming chat responses
- CORS support for local development

## Technology Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **LangChain**: Framework for working with language models
- **Pinecone**: Vector database for semantic search
- **OpenAI**: Embeddings generation
- **PyMuPDF**: PDF processing and text extraction

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file with the following variables:
   ```
   PINECONE_INDEX=lmnotes-index
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   ```

## API Endpoints

### Document Management

- `POST /upload`: Upload a PDF document

  - Required fields:
    - `file`: PDF file
    - `notebookId`: String
    - `sourceId`: String

- `DELETE /documents`: Delete all documents
- `DELETE /documents/notebook/{notebookId}`: Delete all documents for a specific notebook
- `DELETE /documents/source/{sourceId}`: Delete all documents for a specific source

### Chat

- `POST /chat-stream`: Stream chat responses
  - Body: `{"message": "your message"}`

## Document Processing

The application processes PDFs in the following way:

1. PDF is uploaded and temporarily stored
2. Document is split into chunks using RecursiveCharacterTextSplitter
3. Chunks are processed in batches of 100
4. Each chunk is embedded and stored in Pinecone with metadata:
   - sourceId
   - notebookId
   - upload_date
   - page_count
   - content_type
   - chunk_index
   - total_chunks

## Development

The API includes CORS middleware for local development, allowing requests from any origin. This can be configured in production by modifying the CORS settings in `main.py`.

## Error Handling

The API includes proper error handling for:

- Invalid file types (only PDFs supported)
- Missing required fields
- Document processing errors
- Vector store operations

## License

[Your License Here]
