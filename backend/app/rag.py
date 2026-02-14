from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tempfile
from dotenv import load_dotenv
import chromadb
import os
from sentence_transformers import SentenceTransformer
from sqlmodel import Session,select
from app.database import engine
from app.models import Document
from app.routes.document import save_documents
from transformers import pipeline
from langchain_huggingface import HuggingFacePipeline

load_dotenv()
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

model = SentenceTransformer('all-MiniLM-L6-v2')
model_id = "HuggingFaceTB/SmolLM2-135M-Instruct"

def ask_rag_question(content_list, question):
    pipe = pipeline("text-generation", model=model_id, device="cpu", max_new_tokens=256)
    llm = HuggingFacePipeline(pipeline=pipe)
    context_text = "\n\n".join([res.content for res in content_list])
    prompt = f"""
    You are a helpful assistant. Use the following pieces of context to answer the question.
    If you don't know the answer based on the context, just say you don't know.

    CONTEXT:
    {context_text}

    QUESTION: 
    {question}

    ANSWER:
    """

    response = llm.invoke(prompt)
    return response


def search_user_documents(user_id: int, query_text: str, top_k: int = 5):
    query_vector = model.encode(query_text).tolist()
    with Session(engine) as session:
        statement = (
            select(Document)
            .where(Document.user_id == user_id)
            .order_by(Document.embedding.cosine_distance(query_vector))
            .limit(top_k)
        )

        results = session.exec(statement).all()
        return results

def saveFileToDB(file_content, extension, user_id, file_path, filename):
    text = gatherFileContext(file_content, extension)
    chunks = chunkFile(text)
    text_chunks = [chunk.page_content for chunk in chunks]

    embeddings = model.encode(text_chunks).tolist()
    all_metadatas = [doc.metadata for doc in chunks]
    new_docs = []
    for i in range(len(embeddings)):
        new_doc=Document(
            content=text_chunks[i],
            embedding=embeddings[i],
            user_id=user_id,
            file_path=file_path,
            page=all_metadatas[i].get("page_label", 0),
            filename=filename
        )
        new_docs.append(new_doc)

    save_documents(new_docs)

def gatherFileContext(file_content, extension):
    with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp_file:
        tmp_file.write(file_content)
        tmp_path = tmp_file.name

    if(extension == ".pdf"):
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()
        return docs
    return ""

def chunkFile(data):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(data)
    return chunks
