from groq import Groq

client = Groq()

def answer_ai_question(query):
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": query
            }
        ],
        temperature=1,
        max_completion_tokens=8192,
        top_p=1,
        stream=True,
        stop=None
    )
    result = ""
    for chunk in completion:
        content = chunk.choices[0].delta.content
        if content is not None:
            result += content
    return result