from flask import Flask, request, jsonify
from llama_cpp import Llama
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
llm = Llama(model_path="E:/tinyllama-1.1b-chat-v1.0.Q4_0.gguf", n_ctx=512)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'summary': ''})
    try:
        # Try a simple prompt first
        output = llm(text, max_tokens=32, stop=["\n"])
        summary = output['choices'][0]['text'].strip()
        return jsonify({'summary': summary})
    except Exception as e:
        print("Error during summarization:", e)
        return jsonify({'summary': 'Error summarizing.'}), 500

if __name__ == '__main__':
    app.run(port=5000)