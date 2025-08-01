# Share Reading & Watch Lists

A full-stack web application demonstrating modern web development skills through automatic browser content tracking, local AI-powered summarization, and social sharing features. Built with React, Flask, Chrome Extension APIs, and local machine learning.

Demo: https://www.youtube.com/watch?v=CkFv9XCG7js&t=4s
## Project Overview

This project showcases proficiency in **full-stack development**, **browser automation**, and **AI integration** by creating a privacy-focused content tracking system that automatically monitors browsing history and generates local AI summaries without external API dependencies.

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks and functional components
- **Material-UI 7.1.2** - Professional component library
- **React Router DOM 7.6.2** - Client-side routing
- **Vite 7.0.0** - Fast build tool and dev server

### Backend
- **Flask 3.1.1** - Python web framework with RESTful API design
- **SQLAlchemy 2.0.41** - ORM for database operations and relationships
- **Flask-SQLAlchemy 3.1.1** - Database integration
- **Flask-CORS 6.0.1** - Cross-origin resource sharing

### Browser Extension
- **Chrome Extension Manifest V3** - Modern extension framework
- **JavaScript ES6+** - Modern JavaScript with async/await
- **Chrome Extension APIs** - tabs, storage, scripting, history
- **Webpack 5** - Module bundler for extension build

### AI & Machine Learning
- **llama-cpp-python 0.3.9** - Local LLM inference
- **TinyLlama-1.1B-Chat-v1.0** - Efficient 1.1B parameter model
- **GGUF Format** - Optimized for CPU inference
- **Local Processing** - 100% privacy-focused, no external APIs

### Database
- **SQLite** - Lightweight database with three-table schema:
  - `User` - Authentication and profiles
  - `Item` - Tracked content with metadata
  - `Follow` - Social relationships

## 🏗️ Architecture

### System Design
```
Chrome Extension → Flask Backend → SQLite Database
       ↓              ↓              ↓
   Content        API Endpoints   Data Storage
   Detection      Authentication   Relationships
       ↓              ↓              ↓
   React Frontend ← HTTP API ← AI Summarization
   (Material-UI)   (RESTful)    (Local LLM)
```

### Key Features Implemented
- **Real-time browser tracking** with content classification
- **Direct HTTP API communication** between extension and backend
- **Local AI summarization** using TinyLlama model
- **Social features** with follow/unfollow system
- **Responsive web interface** with Material-UI components

## 🚀 Quick Demo

### Prerequisites
- Python 3.8+, Node.js 16+, Chrome browser
- C++ compiler (for llama-cpp-python)

### Setup (5 minutes)
```bash
# Clone and setup
git clone <repository-url>
cd share_reading_watch_lists

# Install dependencies
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cd web-frontend && npm install && cd ..
cd extension/chrome && npm install && cd ../..

# Download AI model
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf

# Start services
python llama_worker.py &      # AI service (port 5001)
python summarize_api.py &     # Backend API (port 5000)
cd web-frontend && npm run dev # Frontend (port 5173)

# Load extension in Chrome (chrome://extensions/ → Load unpacked → extension/chrome/dist/)
```

## 💻 Technical Implementation

### Content Detection Algorithm
```javascript
function shouldTrack(url, title) {
  const VIDEO_SITES = ['youtube.com', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
  
  // Video site detection
  if (VIDEO_SITES.some(site => hostname.includes(site))) {
    return { track: true, type: 'video' };
  }
  
  // Article detection (title length heuristic)
  const titleWords = title.trim().split(/\s+/);
  if (titleWords.length > 4) {
    return { track: true, type: 'article' };
  }
  
  return { track: false, type: null };
}
```

### Real-time Data Flow
```javascript
// Extension → Backend communication
fetch('http://localhost:5000/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: pageData.title,
    url: pageData.url,
    type: type,
    username: username
  }),
})
```

### AI Summarization Pipeline
```python
def create_summary_prompt(title, url, content_type='content'):
    if content_type == 'video':
        return f"""<|system|>
You are a helpful assistant. Based ONLY on the title provided, please generate a short, speculative summary of what this video might be about. Do not pretend you have watched it. Respond only with the summary text.</s>
<|user|>
Speculate on the content of the video with the following title:
Title: {title}</s>
<|assistant|>
"""
```

## 🎓 Skills Demonstrated

### Frontend Development
- **Modern React patterns** - Hooks, functional components, state management
- **Component architecture** - Reusable, maintainable UI components
- **Responsive design** - Mobile-first, accessible interfaces
- **State synchronization** - Real-time data updates across components

### Backend Development
- **RESTful API design** - Proper HTTP methods and status codes
- **Database modeling** - Relational database design with SQLAlchemy
- **Authentication systems** - Session-based user management
- **Microservice architecture** - Separated AI processing service

### Browser Extension Development
- **Chrome Extension APIs** - Manifest V3, service workers, content scripts
- **Cross-origin communication** - Extension-to-backend data flow
- **User interface design** - Popup interfaces and user experience
- **Browser automation** - Real-time page monitoring and data extraction

### AI/ML Integration
- **Local model deployment** - llama-cpp-python integration
- **Prompt engineering** - Specialized prompts for different content types
- **Privacy-preserving AI** - Local inference without external dependencies
- **Model optimization** - GGUF format for efficient CPU inference

## 📊 Project Metrics

- **Lines of Code:** ~2,000+ across multiple technologies
- **Technologies Used:** 8+ modern frameworks and libraries
- **Architecture:** Full-stack with microservice design
- **Features:** 15+ implemented features including AI integration
- **Development Time:** Self-directed learning project

## 🔧 API Endpoints

### Core Functionality
- `POST /items` - Add tracked content
- `GET /user/<username>/items` - Retrieve user's content
- `POST /summarize` - Generate AI summaries
- `POST /follow/<username>` - Social features

### Authentication
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /session` - Session management

## 🚧 Current Status

### Completed Features
- ✅ Full-stack data pipeline from browser to visualization
- ✅ Local AI summarization with TinyLlama model
- ✅ Social features (follow/unfollow, public profiles)
- ✅ Real-time content tracking and classification
- ✅ Responsive web interface with Material-UI
- ✅ Chrome extension with background processing

### Learning Focus
- **Core functionality** over production polish
- **Technical implementation** over user experience optimization
- **Full-stack integration** over individual component perfection
- **AI/ML integration** over traditional web development


## 📄 License

This project is open source and available under the MIT License.

