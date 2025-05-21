import os

# os.environ["LANGCHAIN_TRACING_V2"] = "true"

from dotenv import load_dotenv

load_dotenv()
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough


from typing import Any, Dict, List

from langchain import hub
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.retrieval import create_retrieval_chain
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore

pinecone_index = os.getenv("PINECONE_INDEX", "lmnotes-index")
agent_gpt_model = os.getenv("AGENT_GPT_MODEL", "gpt-4")


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def chat_with_agent(query: str, notebook_id: str, chat_history: List[Dict[str, Any]] = []):
    embeddings = OpenAIEmbeddings()
    docsearch = PineconeVectorStore(
        index_name=pinecone_index, 
        embedding=embeddings
    )
    chat = ChatOpenAI(model_name=agent_gpt_model, verbose=True, temperature=0)

    # Create retriever with notebook filter
    retriever = docsearch.as_retriever(
        search_kwargs={
            "k": 5,
            "filter": {"notebookId": notebook_id}
        }
    )

    # Create the RAG chain
    rag_chain = (
        {
            "context": retriever | format_docs,
            "input": RunnablePassthrough(),
        }
        | hub.pull("langchain-ai/retrieval-qa-chat")
        | chat
        | StrOutputParser()
    )

    # Execute the chain
    result = rag_chain.invoke(query)
    return result


# def chat_with_agent(question: str, notebook_id: str) -> str:
#     """Chat with the agent using the specified notebook's documents."""
#     # Format the input to include the notebook ID
#     formatted_input = f"Question: {question}\nNotebook ID: {notebook_id}"
    
#     # Run the agent
#     result = agent_executor.invoke({"input": formatted_input})
#     return result["output"]

if __name__ == "__main__":
    question = "Summarize 'The Art of thinking clearly'"
    notebook_id = "notebook-1"
    print(chat_with_agent(question, notebook_id))