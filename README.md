# Share Reading & Watch Lists

A browser extension and web app that automatically tracks and shares your reading and watching history with intelligent content filtering and local LLM summarization.

## 🚀 Features

### Core Functionality
- **Automatic Content Tracking**: Browser extension automatically detects and tracks articles and videos you visit
- **Intelligent Content Filtering**: Uses local LLM to automatically identify high-quality, meaningful content worth sharing
- **Local LLM Summarization**: Generates summaries using TinyLlama running locally on your machine
- **Social Features**: Follow other users and see what they're reading/watching in your feed
- **Public Profiles**: Share your intellectual footprint with others

### Browser Extension
- **Seamless Tracking**: Works in the background, no manual input required
- **Quality Detection**: Only tracks high-quality content (filters out social media, ads, low-quality content)
- **Login Integration**: Syncs with your web app account
- **Real-time Updates**: Shows recent tracked items in popup

### Web Application
- **Modern UI**: Built with React and Material-UI
- **User Authentication**: Secure login/register system
- **Profile Pages**: View your own and others' reading/watch lists
- **Social Feed**: See content from people you follow
- **User Discovery**: Search and follow other users
- **Auto-Summarization**: Generate summaries for all tracked content

## 🛠️ Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Chrome browser
- 4GB+ RAM (for LLM)

### 1. Backend Setup

```bash
# Install Python dependencies
pip install flask flask-cors flask-sqlalchemy werkzeug requests llama-cpp-python

# Download TinyLlama model (if not already downloaded)
# Place tinyllama-1.1b-chat-v1.0.Q4_0.gguf in the project root

# Initialize database
python summarize_api.py
# Visit http://127.0.0.1:5000/initdb

# Start the main API server
python summarize_api.py

# In another terminal, start the LLM worker
python llama_worker.py
```

### 2. Frontend Setup

```bash
cd web-frontend
npm install
npm run dev
```

### 3. Browser Extension Setup

```bash
cd extension/chrome
npm install
npm run build
```

Then load the extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/chrome/dist` folder

## 📖 Usage

### Getting Started
1. **Register/Login**: Create an account on the web app
2. **Login to Extension**: Use the same credentials in the browser extension
3. **Start Browsing**: The extension will automatically track high-quality content
4. **View Your Profile**: See your tracked items and summaries on the web app
5. **Follow Others**: Discover and follow other users to see their content

### Features in Action

#### Automatic Content Detection
- Visit any article or video
- Extension automatically evaluates content quality using LLM
- Only high-quality content gets added to your list
- No manual curation required

#### Social Features
- **Follow Users**: Click the follow button on any user's profile
- **Discover Content**: Use the search in the Feed page to find users
- **View Feed**: See content from people you follow in your personalized feed
- **Public Profiles**: Share your profile URL with others

#### Content Management
- **Auto-Summarization**: Click "Auto-Summarize All" to generate summaries
- **View Original**: Click links to visit the original content
- **Filter by Type**: See articles and videos separately

## 🔧 Technical Details

### Architecture
- **Backend**: Flask API with SQLAlchemy database
- **LLM Service**: Separate Flask service running TinyLlama
- **Frontend**: React with Material-UI
- **Extension**: Chrome extension with background/content scripts
- **Database**: SQLite with User, Item, and Follow models

### LLM Integration
- **Model**: TinyLlama 1.1B Chat (GGUF format)
- **Quality Detection**: Evaluates content worthiness before tracking
- **Summarization**: Generates concise summaries of tracked content
- **Local Processing**: No external API calls, everything runs locally

### Data Flow
1. User visits webpage → Extension detects content
2. Extension calls LLM to evaluate quality
3. If high-quality → Sends to backend API
4. Backend stores in database and generates summary
5. Web app displays content with summaries
6. Other users can follow and see content in their feed

## 🎯 Problem Solved

**Before**: People read articles and watch videos, but there's no easy way to showcase what they're consuming. Manual tools like Notion require effort.

**After**: 
- **Zero Manual Input**: Extension automatically tracks everything
- **Quality Filtering**: LLM automatically picks out meaningful content
- **Social Sharing**: Public profiles let others see your intellectual footprint
- **Discovery**: Follow others to discover new content
- **Effortless**: Build your reading/watch list with zero manual curation

## 🔒 Privacy & Security

- **Local LLM**: All content evaluation happens locally
- **User Control**: Choose what to share publicly
- **Secure Authentication**: Password hashing and session management
- **No External APIs**: Everything runs on your machine

## 🚧 Development

### Project Structure
```
share_reading_watch_lists/
├── extension/chrome/          # Browser extension
├── web-frontend/             # React web app
├── summarize_api.py          # Main Flask API
├── llama_worker.py           # LLM service
└── README.md
```

### Key Files
- `summarize_api.py`: Main API with auth, follow system, item management
- `llama_worker.py`: LLM service for quality detection and summarization
- `web-frontend/src/pages/`: React components for UI
- `extension/chrome/dist/`: Built extension files

### Adding Features
- **New API Endpoints**: Add to `summarize_api.py`
- **UI Components**: Add to `web-frontend/src/pages/`
- **Extension Features**: Modify `extension/chrome/dist/background.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


## 🙏 Acknowledgments

- TinyLlama team for the lightweight LLM
- Chrome Extension API for browser integration
- Material-UI for the beautiful components
- Flask and React communities for the excellent frameworks

---

## 📋 Project Structure
```
share_reading_watch_lists/
├── extension/         # Browser extension (Chrome)
├── web-frontend/      # React web app
└── README.md
```

---


---
