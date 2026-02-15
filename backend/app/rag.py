from langchain_community.document_loaders import PyPDFLoader,TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import tempfile
from dotenv import load_dotenv
import os
from sentence_transformers import SentenceTransformer
from sqlmodel import Session,select
from app.database import engine
from app.models import Document
from app.routes.document import save_documents
from app.groq import answer_ai_question
from app.routes.file import save_file

load_dotenv()
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

model = SentenceTransformer('all-MiniLM-L6-v2')

def ask_rag_question(content_list, question):
    context_text = "\n\n".join([res['content'] for res in content_list])
    prompt = f"""
        You are a helpful assistant. Use the following pieces of context to answer the question.
        Please format the answer suitable.
        CONTEXT:
        {context_text}

        QUESTION: 
        {question}

        ANSWER:
        """

    return answer_ai_question(prompt)

def search_user_documents(user_id: int, query_text: str, top_k: int = 7):
    query_vector = model.encode(query_text).tolist()
    with Session(engine) as session:
        distance_col = Document.embedding.cosine_distance(query_vector).label("distance")

        statement = (
            select(Document, distance_col)
            .where(Document.user_id == user_id)
            .order_by(distance_col)
            .limit(top_k)
        )

        results = session.exec(statement).all()

        formatted_results = []
        for doc, distance in results:
            match_percentage = round((1 - distance) * 100, 2)

            formatted_results.append({
                "document": doc,
                "match_score": f"{match_percentage}%"
            })

        return formatted_results

def saveFileToDB(file_content, extension, user_id, file_path, filename, chunk_size):
    text = gatherFileContext(file_content, extension)
    chunks = chunkFile(text, chunk_size)
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
    save_file(file_path, filename, len(chunks), user_id)
    save_documents(new_docs)

def gatherFileContext(file_content, extension):
    with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp_file:
        tmp_file.write(file_content)
        tmp_path = tmp_file.name

    if(extension == ".pdf"):
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()
        return docs
    elif extension in [".txt", ".md"]:
        loader = TextLoader(tmp_path, encoding='utf-8')
        return loader.load()

    return ""

def chunkFile(data, chunk_size):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=100)
    chunks = text_splitter.split_documents(data)
    return chunks
