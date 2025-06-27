from flask import Flask, request, jsonify
from llama_cpp import Llama

app = Flask(__name__)
llm = Llama(model_path="E:/tinyllama-1.1b-chat-v1.0.Q4_0.gguf", n_ctx=512)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    output = llm(f"Summarize: {text}", max_tokens=32, stop=["\n"])
    summary = output["choices"][0]["text"]
    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(port=5000)