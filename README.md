# Share Reading & Watch Lists

A full-stack web application that automatically tracks and visualizes your browsing history for articles and videos, featuring local AI-powered content summarization and social sharing capabilities. Built with modern web technologies and privacy-first design principles.

## 🚀 Live Demo

- **Web Application:** http://localhost:5173 (after setup)
- **Backend API:** http://localhost:5000
- **AI Summarization Service:** http://localhost:5001

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with latest features and hooks
- **Material-UI 7.1.2** - Professional component library for consistent UI/UX
- **React Router DOM 7.6.2** - Client-side routing and navigation
- **Vite 7.0.0** - Fast build tool and development server

### Backend
- **Flask 3.1.1** - Python web framework for API development
- **SQLAlchemy 2.0.41** - ORM for database operations and relationships
- **Flask-SQLAlchemy 3.1.1** - Flask-SQLAlchemy integration
- **Flask-CORS 6.0.1** - Cross-origin resource sharing support

### Browser Extension
- **Chrome Extension Manifest V3** - Modern extension framework
- **JavaScript ES6+** - Modern JavaScript with async/await
- **Chrome Extension APIs** - tabs, storage, scripting, history
- **Webpack 5** - Module bundler for extension build process

### AI & Machine Learning
- **llama-cpp-python 0.3.9** - Python bindings for local LLM inference
- **TinyLlama-1.1B-Chat-v1.0** - Efficient 1.1B parameter language model
- **GGUF Format** - Optimized model format for CPU inference
- **Local Processing** - 100% privacy-focused, no external API calls

### Database
- **SQLite** - Lightweight, file-based database
- **Three-table Schema:**
  - `User` - User authentication and profiles
  - `Item` - Tracked articles and videos with metadata
  - `Follow` - Social following relationships

## 🏗️ Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome        │    │   React         │    │   Flask         │
│   Extension     │    │   Frontend      │    │   Backend       │
│                 │    │                 │    │                 │
│ • Background    │    │ • Profile       │    │ • User Auth     │
│   Service       │    │   Management    │    │ • API Endpoints │
│ • Content       │    │ • Social Feed   │    │ • Database      │
│   Scripts       │    │ • Real-time     │    │   Operations    │
│ • Popup UI      │    │   Updates       │    │ • Data          │
└─────────────────┘    └─────────────────┘    │   Processing    │
         │                       │            └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SQLite Database                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Users     │  │   Items     │  │   Follows   │            │
│  │             │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │   LLM Worker    │
                    │   (Port 5001)   │
                    │                 │
                    │ • TinyLlama     │
                    │   1.1B Model    │
                    │ • Local         │
                    │   Inference     │
                    └─────────────────┘
```

### Data Flow Pipeline
1. **Browser Tracking** → Chrome extension monitors page visits
2. **Content Detection** → Heuristic-based article/video classification
3. **HTTP API Communication** → Direct POST requests to Flask backend
4. **Database Storage** → SQLAlchemy ORM with relationship management
5. **AI Summarization** → Local TinyLlama model generates content summaries
6. **Web Visualization** → React frontend with Material-UI components
7. **Social Features** → Follow/unfollow system with public feeds

## ✨ Key Features

### 🔍 Automatic Content Tracking
- **Real-time monitoring** of browser activity
- **Smart content classification** (articles vs videos)
- **Deduplication system** prevents duplicate entries
- **URL normalization** for consistent data storage

### 🤖 Local AI Summarization
- **Privacy-first approach** - no data leaves your machine
- **TinyLlama-1.1B model** running on CPU
- **Automatic content summarization** for articles and videos
- **Speculative video summaries** based on titles
- **Batch processing** for multiple items

### 👥 Social Features
- **User authentication** with session management
- **Follow/unfollow system** for social connections
- **Public user profiles** with tracked content
- **Social feed** showing content from followed users
- **User search** and discovery

### 📊 Data Visualization
- **Real-time statistics** in extension popup
- **Grid-based content display** with Material-UI cards
- **Content type filtering** (articles vs videos)
- **Chronological organization** with timestamps
- **Responsive design** for different screen sizes

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Chrome browser** for extension testing
- **C++ compiler** (for llama-cpp-python compilation)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd share_reading_watch_lists

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd web-frontend
npm install
cd ..

# Install extension dependencies
cd extension/chrome
npm install
cd ../..
```

### 3. Download AI Model
```bash
# Download TinyLlama model (~637MB)
wget https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf

# Verify the model path in llama_worker.py matches your download
```

### 4. Initialize Database
```bash
# Start the main backend
python summarize_api.py

# In a new terminal, initialize the database
curl http://localhost:5000/initdb
```

### 5. Start All Services
```bash
# Terminal 1: AI Summarization Service
python llama_worker.py

# Terminal 2: Main Backend API
python summarize_api.py

# Terminal 3: React Frontend
cd web-frontend
npm run dev
```

### 6. Load Chrome Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select `extension/chrome/dist/`
4. The extension icon should appear in your toolbar

### 7. First-Time Setup
1. Visit http://localhost:5173
2. Register a new account
3. Browse some articles/videos while logged in
4. Check your profile to see tracked content
5. Use "Auto-Summarize All" to generate AI summaries

## 📁 Project Structure
```
share_reading_watch_lists/
├── extension/chrome/          # Chrome extension source
│   ├── src/                  # Extension source files
│   ├── dist/                 # Built extension files
│   ├── package.json          # Extension dependencies
│   └── webpack.config.js     # Build configuration
├── web-frontend/             # React web application
│   ├── src/                  # React source code
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # App entry point
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── summarize_api.py          # Main Flask backend
├── llama_worker.py           # AI summarization service
├── requirements.txt          # Python dependencies
├── README.md                 # This file
└── tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf  # AI model file
```

## 🔧 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /logout` - User logout
- `GET /session` - Check session status

### Content Management
- `POST /items` - Add new tracked item
- `GET /items` - Get all items (admin)
- `GET /user/<username>/items` - Get user's items
- `DELETE /item/<id>` - Delete specific item

### Social Features
- `POST /follow/<username>` - Follow a user
- `POST /unfollow/<username>` - Unfollow a user
- `GET /followers/<username>` - Get user's followers
- `GET /following/<username>` - Get user's following
- `GET /feed` - Get social feed
- `GET /is_following/<username>` - Check follow status

### AI Summarization
- `POST /summarize` - Generate content summary (via llama_worker)

## 🎯 Technical Implementation Details

### Content Detection Algorithm
```javascript
function shouldTrack(url, title) {
  const VIDEO_SITES = ['youtube.com', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
  const SEARCH_ENGINES = ['google.com', 'bing.com', 'duckduckgo.com'];
  
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
# Prompt engineering for different content types
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

## 🔒 Privacy & Security Features

### Privacy-First Design
- **Local AI processing** - No data sent to external APIs
- **User-controlled data** - All content stored locally
- **No tracking scripts** - Extension only tracks user-initiated visits
- **Transparent operation** - All code is open source

### Data Protection
- **Session-based authentication** - Secure user sessions
- **Input validation** - Prevents malicious data injection
- **CORS configuration** - Controlled cross-origin requests
- **Database relationships** - Proper data integrity constraints

## 🚧 Current Limitations

### Technical Limitations
- **Single-user focused** - Not optimized for high concurrent usage
- **Basic content detection** - Relies on simple heuristics
- **Local processing only** - AI model requires local CPU resources
- **Chrome-only extension** - No Firefox/Safari support yet

### Development Status
- **Learning project** - Demonstrates full-stack development skills
- **No production deployment** - Designed for local development
- **Limited error handling** - Focus on core functionality
- **No automated testing** - Manual testing required

## 🎓 Learning Outcomes

This project demonstrates proficiency in:

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

## 🤝 Contributing

This is a learning project demonstrating full-stack development skills. Contributions are welcome for:

- **Bug fixes** and error handling improvements
- **Feature enhancements** and new functionality
- **Documentation** improvements and clarifications
- **Code optimization** and performance improvements

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **TinyLlama team** for the lightweight, efficient language model
- **Flask community** for the robust web framework
- **React team** for the modern frontend library
- **Material-UI team** for the comprehensive component library
- **Chrome Extension community** for the browser automation tools

---

**Built with ❤️ for learning modern full-stack web development and AI integration.**
