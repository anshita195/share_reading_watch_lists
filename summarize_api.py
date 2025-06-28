from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import uuid
import logging

app = Flask(__name__)
# Allow requests from your web app and your extension
CORS(app, origins=["http://localhost:5173", "chrome-extension://*"])

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

# In-memory storage for tracked items per user
# { username: [item, ...] }
tracked_items_by_user = {}

@app.route('/items', methods=['GET'])
def get_items():
    app.logger.info("GET /items called")
    # Return all items for all users (for admin/debug)
    all_items = []
    for items in tracked_items_by_user.values():
        all_items.extend(items)
    return jsonify(all_items)

@app.route('/items', methods=['POST'])
def add_item():
    data = request.get_json()
    app.logger.info(f"POST /items with data: {data}")
    if not data or 'title' not in data or 'type' not in data or 'username' not in data:
        app.logger.error('Invalid data received in POST /items')
        return jsonify({'error': 'Invalid data'}), 400
    username = data['username']
    prompt = f"Summarize: {data['title']} {data.get('url', '')}"
    summary = ''
    try:
        resp = requests.post('http://127.0.0.1:5001/summarize', json={'prompt': prompt}, timeout=30)
        if resp.ok:
            summary = resp.json().get('summary', '')
        else:
            summary = 'Error summarizing.'
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
    if username not in tracked_items_by_user:
        tracked_items_by_user[username] = []
    tracked_items_by_user[username].append(new_item)
    app.logger.info(f"Item added for user {username}: {new_item}")
    return jsonify(new_item), 201

@app.route('/user/<username>/items', methods=['GET'])
def get_user_items(username):
    app.logger.info(f"GET /user/{username}/items called")
    items = tracked_items_by_user.get(username, [])
    return jsonify(items)

if __name__ == '__main__':
    app.run(port=5000)