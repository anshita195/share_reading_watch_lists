from flask import Flask, request, jsonify
from llama_cpp import Llama

app = Flask(__name__)

# Load the model once at startup
llm = Llama(model_path="E:/tinyllama-1.1b-chat-v1.0.Q4_0.gguf", n_ctx=512)

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    prompt = data.get('prompt', '')
    try:
        output = llm(prompt, max_tokens=32, stop=["\n"])
        summary = output['choices'][0]['text'].strip()
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001) 