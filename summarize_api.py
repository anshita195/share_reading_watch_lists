from flask import Flask, request, jsonify
from llama_cpp import Llama
from flask_cors import CORS
import uuid
import logging

app = Flask(__name__)
# Allow requests from your web app and your extension
CORS(app, origins=["http://localhost:5173", "chrome-extension://*"]) 
llm = Llama(model_path="E:/tinyllama-1.1b-chat-v1.0.Q4_0.gguf", n_ctx=512)

# Set logging level to DEBUG
app.logger.setLevel(logging.DEBUG)

# Log every request
@app.before_request
def log_request_info():
    app.logger.info(f"Request: {request.method} {request.url} - {request.get_data()}")

# Global error handler
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled exception: {e}", exc_info=True)
    return "Internal Server Error", 500

# In-memory storage for tracked items
tracked_items = []

@app.route('/items', methods=['GET'])
def get_items():
    app.logger.info("GET /items called")
    return jsonify(tracked_items)

@app.route('/items', methods=['POST'])
def add_item():
    data = request.get_json()
    app.logger.info(f"POST /items with data: {data}")
    if not data or 'title' not in data or 'type' not in data:
        app.logger.error('Invalid data received in POST /items')
        return jsonify({'error': 'Invalid data'}), 400
    try:
        prompt = f"Summarize: {data['title']} {data.get('url', '')}"
        output = llm(prompt, max_tokens=32, stop=["\n"])
        summary = output['choices'][0]['text'].strip()
        app.logger.info(f"Summary generated: {summary}")
    except Exception as e:
        app.logger.error("Error during summarization:", exc_info=True)
        summary = 'Error summarizing.'
    new_item = {
        'id': str(uuid.uuid4()),
        'title': data['title'],
        'type': data['type'],
        'url': data.get('url', ''),
        'summary': summary
    }
    tracked_items.append(new_item)
    app.logger.info(f"Item added: {new_item}")
    return jsonify(new_item), 201

if __name__ == '__main__':
    app.run(port=5000)