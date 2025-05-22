import os
from typing import Any, Dict, List
from dotenv import load_dotenv

# LangChain imports
from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Configuration
PINECONE_INDEX = os.getenv("PINECONE_INDEX", "lmnotes-index")
AGENT_GPT_MODEL = os.getenv("AGENT_GPT_MODEL", "gpt-4")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"

def debug_print(message: str) -> None:
    """Print debug messages if DEBUG is enabled."""
    if DEBUG:
        print(f"[DEBUG] {message}")

def format_docs(docs) -> str:
    """Format documents into a single string with source information."""
    debug_print(f"Formatting {len(docs)} documents")
    
    formatted_parts = []
    for i, doc in enumerate(docs, 1):
        source_info = f"[Source: {doc.metadata.get('source', 'Unknown')}"
        if 'page' in doc.metadata:
            source_info += f", Page {doc.metadata['page']}"
        source_info += "]"
        formatted_parts.append(f"{doc.page_content}\n{source_info}")
    
    result = "\n\n".join(formatted_parts)
    debug_print(f"Formatted result: {result}")
    return result

def create_retriever(notebook_id: str) -> Any:
    """Create a retriever for the specified notebook."""
    debug_print(f"Creating retriever for notebook: {notebook_id}")
    
    embeddings = OpenAIEmbeddings()
    docsearch = PineconeVectorStore(
        index_name=PINECONE_INDEX, 
        embedding=embeddings
    )
    
    return docsearch.as_retriever(
        search_kwargs={
            "k": 5,
            "filter": {"notebookId": notebook_id}
        }
    )

def create_rag_chain(retriever: Any) -> Any:
    """Create a RAG chain with the given retriever."""
    debug_print("Creating RAG chain")
    
    chat = ChatOpenAI(
        model_name=AGENT_GPT_MODEL, 
        verbose=True, 
        temperature=0
    )
    
    # Custom prompt template that instructs the LLM to include references
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful AI assistant that answers questions based on the user's uploaded sources, such as PDFs and notes.

Always use the available document snippets to ground your answer.

When answering, include references to the original source whenever possible. This includes:
- the document name (`source`)
- page number (`page`)
- line number (`line`)

If no relevant information is found, politely respond that you cannot answer based on the available sources."""),
        ("human", """Context: {context}
        
        Question: {input}
        
        Please provide a detailed answer with references to the source documents. 
        Try to format the answer in a way that is easy to understand and as markdown.
        """)
    ])
    
    return (
        {
            "context": retriever | format_docs,
            "input": RunnablePassthrough(),
        }
        | prompt
        | chat
        | StrOutputParser()
    )

def chat_with_agent(query: str, notebook_id: str, chat_history: List[Dict[str, Any]] = []) -> str:
    """
    Chat with the agent using the specified notebook's documents.
    
    Args:
        query: The question to ask
        notebook_id: The ID of the notebook to search in
        chat_history: Optional chat history for context
        
    Returns:
        The agent's response with embedded references
    """
    debug_print(f"Processing query: {query}")
    debug_print(f"Using notebook: {notebook_id}")
    
    # Create retriever and chain
    # TODO: chat_history
    agent = create_rag_agent(notebook_id)
    
    # Execute the chain
    debug_print("Executing RAG chain")
    result = agent.invoke(query)
    debug_print("Chain execution completed")
    
    return result

def create_rag_agent(notebook_id: str):
    # Create retriever and chain
    retriever = create_retriever(notebook_id)
    rag_chain = create_rag_chain(retriever)
    return rag_chain


if __name__ == "__main__":
    # Example usage
    question = "Summarize 'The Art of thinking clearly'"
    notebook_id = "notebook-1" # replace with the actual notebook id
    
    debug_print("Starting example chat")
    response = chat_with_agent(question, notebook_id)
    print("\nResponse:", response)