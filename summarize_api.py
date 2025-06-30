from flask import Flask, request, jsonify, session
import requests
from flask_cors import CORS
import uuid
import logging
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from urllib.parse import urlparse, parse_qs

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Change this in production
# Allow requests from your web app and your extension
CORS(app, origins=["http://localhost:5173", "chrome-extension://*"], supports_credentials=True)

# --- SQLAlchemy setup ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    items = db.relationship('Item', backref='user', lazy=True)
    followers = db.relationship('Follow', foreign_keys='Follow.followed_id', backref='followed', lazy='dynamic')
    following = db.relationship('Follow', foreign_keys='Follow.follower_id', backref='follower', lazy='dynamic')

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    url = db.Column(db.String(512), nullable=False)
    type = db.Column(db.String(32), nullable=False)
    summary = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Follow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    followed_id = db.Column(db.Integer, db.ForeignKey('user.id'))

# --- End SQLAlchemy setup ---

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

# In-memory storage for tracked items per user (will migrate to DB later)
tracked_items_by_user = {}

@app.route('/initdb')
def initdb():
    db.create_all()
    return 'Database initialized!'

@app.route('/items', methods=['GET'])
def get_items():
    app.logger.info("GET /items called")
    # Return all items for all users (for admin/debug)
    items = Item.query.order_by(Item.timestamp.desc()).all()
    result = []
    for item in items:
        result.append({
            'id': item.id,
            'title': item.title,
            'type': item.type,
            'url': item.url,
            'summary': item.summary,
            'username': item.user.username,
            'timestamp': item.timestamp.isoformat()
        })
    return jsonify(result)

@app.route('/items', methods=['POST'])
def add_item():
    data = request.get_json()
    app.logger.info(f"POST /items with data: {data}")
    if not data or 'title' not in data or 'type' not in data or 'username' not in data:
        app.logger.error('Invalid data received in POST /items')
        return jsonify({'error': 'Invalid data'}), 400
    username = data['username']
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # --- Normalize URL and Check for Duplicates ---
    original_url = data.get('url')
    url_to_check = original_url

    if url_to_check:
        try:
            # Normalize YouTube URLs
            parsed_url = urlparse(url_to_check)
            if 'youtube.com' in parsed_url.hostname or 'youtu.be' in parsed_url.hostname:
                if 'v' in parse_qs(parsed_url.query):
                    video_id = parse_qs(parsed_url.query)['v'][0]
                    url_to_check = f"https://www.youtube.com/watch?v={video_id}"
        except Exception as e:
            app.logger.error(f"URL parsing failed for {url_to_check}: {e}")
            # Continue with the original URL if parsing fails

        existing_item = Item.query.filter_by(user_id=user.id, url=url_to_check).first()
        if existing_item:
            app.logger.info(f"Item already tracked for user {username}: {url_to_check}")
            return jsonify({'message': 'Item already tracked'}), 200

    summary = ''
    try:
        # Call the local LLM worker for summarization
        payload = {
            'title': data['title'], 
            'url': original_url,
            'type': data['type']
        }
        resp = requests.post('http://localhost:5001/summarize', json=payload, timeout=90)
        
        if resp.ok:
            summary = resp.json().get('summary', 'No summary available.')
        else:
            app.logger.warning(f"Summarization failed with status {resp.status_code}: {resp.text}")
            summary = 'Could not generate summary.'
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error connecting to summarization worker: {e}")
        summary = 'Summarization service is unavailable.'

    new_item = Item(
        user_id=user.id,
        title=data['title'],
        type=data['type'],
        url=url_to_check, # Save the normalized URL
        summary=summary
    )
    db.session.add(new_item)
    db.session.commit()
    app.logger.info(f"Item added for user {username}: {new_item.title}")
    return jsonify({
        'id': new_item.id,
        'title': new_item.title,
        'type': new_item.type,
        'url': new_item.url,
        'summary': new_item.summary,
        'username': username,
        'timestamp': new_item.timestamp.isoformat()
    }), 201

@app.route('/item/<int:item_id>', methods=['DELETE', 'OPTIONS'])
def delete_item(item_id):
    if request.method == 'OPTIONS':
        return '', 200 # Preflight-OK
        
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401

    item = Item.query.get(item_id)

    if not item:
        return jsonify({'error': 'Item not found'}), 404

    if item.user_id != session['user_id']:
        return jsonify({'error': 'Forbidden'}), 403
    
    db.session.delete(item)
    db.session.commit()
    
    return jsonify({'message': 'Item deleted successfully'})

@app.route('/user/<username>/items', methods=['GET'])
def get_user_items(username):
    app.logger.info(f"GET /user/{username}/items called")
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify([])
    items = Item.query.filter_by(user_id=user.id).order_by(Item.timestamp.desc()).all()
    result = []
    for item in items:
        result.append({
            'id': item.id,
            'title': item.title,
            'type': item.type,
            'url': item.url,
            'summary': item.summary,
            'username': username,
            'timestamp': item.timestamp.isoformat()
        })
    return jsonify(result)

# --- Auth Endpoints ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    user = User(username=username, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    session['user_id'] = user.id
    session['username'] = user.username
    return jsonify({'message': 'Logged in successfully', 'username': user.username})

@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'})
# --- End Auth Endpoints ---

# --- Follow System Endpoints ---
@app.route('/follow/<username>', methods=['POST'])
def follow_user(username):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    user_to_follow = User.query.filter_by(username=username).first()
    if not user_to_follow:
        return jsonify({'error': 'User not found'}), 404
    
    if user_to_follow.id == session['user_id']:
        return jsonify({'error': 'Cannot follow yourself'}), 400
    
    # Check if already following
    existing_follow = Follow.query.filter_by(
        follower_id=session['user_id'], 
        followed_id=user_to_follow.id
    ).first()
    
    if existing_follow:
        return jsonify({'error': 'Already following this user'}), 400
    
    new_follow = Follow(follower_id=session['user_id'], followed_id=user_to_follow.id)
    db.session.add(new_follow)
    db.session.commit()
    
    return jsonify({'message': f'Now following {username}'})

@app.route('/unfollow/<username>', methods=['POST'])
def unfollow_user(username):
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    user_to_unfollow = User.query.filter_by(username=username).first()
    if not user_to_unfollow:
        return jsonify({'error': 'User not found'}), 404
    
    follow = Follow.query.filter_by(
        follower_id=session['user_id'], 
        followed_id=user_to_unfollow.id
    ).first()
    
    if not follow:
        return jsonify({'error': 'Not following this user'}), 400
    
    db.session.delete(follow)
    db.session.commit()
    
    return jsonify({'message': f'Unfollowed {username}'})

@app.route('/followers/<username>', methods=['GET'])
def get_followers(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    followers = user.followers.all()
    return jsonify([{
        'id': f.follower.id,
        'username': f.follower.username
    } for f in followers])

@app.route('/following/<username>', methods=['GET'])
def get_following(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    following = user.following.all()
    return jsonify([{
        'id': f.followed.id,
        'username': f.followed.username
    } for f in following])

@app.route('/feed', methods=['GET'])
def get_feed():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    # Get users that the current user is following
    following = Follow.query.filter_by(follower_id=session['user_id']).all()
    followed_ids = [f.followed_id for f in following]
    
    # Get items from followed users
    items = Item.query.filter(Item.user_id.in_(followed_ids)).order_by(Item.timestamp.desc()).limit(50).all()
    
    result = []
    for item in items:
        result.append({
            'id': item.id,
            'title': item.title,
            'type': item.type,
            'url': item.url,
            'summary': item.summary,
            'username': item.user.username,
            'timestamp': item.timestamp.isoformat()
        })
    
    return jsonify(result)

@app.route('/is_following/<username>', methods=['GET'])
def is_following(username):
    if 'user_id' not in session:
        return jsonify({'following': False})
    
    user_to_check = User.query.filter_by(username=username).first()
    if not user_to_check:
        return jsonify({'following': False})
    
    follow = Follow.query.filter_by(
        follower_id=session['user_id'], 
        followed_id=user_to_check.id
    ).first()
    
    return jsonify({'following': follow is not None})

@app.route('/session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return jsonify({
            'logged_in': True,
            'user_id': session['user_id'],
            'username': session.get('username'),
            'user': {
                'id': user.id,
                'username': user.username
            } if user else None
        })
    else:
        return jsonify({'logged_in': False})

# --- End Follow System Endpoints ---

if __name__ == '__main__':
    app.run(port=5000)