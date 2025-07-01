# Share Reading & Watch Lists

Effortlessly track and share what you read and watch online. This project consists of a browser extension and a web app that together let you build a public list of articles and videos you've consumed, with optional local AI-generated summaries—**all running on your own computer, with no external API calls or cloud processing.**

## What This Project Actually Does

- **Browser Extension (Chrome):**
  - Tracks articles and videos you visit in your browser (recent history only).
  - Lets you export your tracked list as a JSON file.
- **Web App:**
  - Lets you import your exported list and view your reading/watch items.
  - Lets you generate a short summary for each item using a local LLM (TinyLlama or similar, running on CPU via llama-cpp-python).
  - Shows your list on a public profile page (demo only; not a real social network).
  - Shows a public feed of all imported items (demo only).

**Note:**
- Summaries are generated based only on the title (not the full article or video transcript).
- There is no real-time sync between extension and web app; you must export/import manually.
- There is no in-browser LLM; all summarization is done via a local Python server.
- No Chrome/Firefox store listing yet; extension must be loaded manually.

## Why This Is Different

Most tools (Notion, Substack, etc.) require manual curation. This project aims for zero manual input: just browse as usual, then export/import to build your public list. Summarization is local and private—no data leaves your machine.

## Features (Current State)
- Track articles/videos you visit in Chrome (extension)
- Export your tracked list as JSON (extension)
- Import your list into the web app
- View your reading/watch list on your profile page
- Generate AI summaries for each item (local LLM)
- Public feed/profile (demo only)

## Limitations & Assumptions
- **No authentication security**—demo only, not production-ready.
- **All LLM inference is local, on CPU, with a small model (<1GB, e.g. TinyLlama-1.1B).**
- **No cloud backend, no production deployment, no extension store listing.**
- **English content only.**

## Setup & Running (for Testing)

### Prerequisites
- Python 3.8+
- Node.js 16+
- C++ compiler (for llama-cpp-python)
- Chrome browser

### 1. Clone the Repository
```bash
git clone <repository_url>
cd share_reading_watch_lists
```

### 2. Download a Small LLM Model
- Download [TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf](https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf) (~637MB)
- Place it in the project root directory.
- Make sure the filename matches the `MODEL_PATH` in `llama_worker.py` (edit if needed).

### 3. Set Up Python Backend
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Start the LLM Summarization Server
```bash
python llama_worker.py
# Wait for "Model loaded successfully."
```

### 5. Start the Main Backend API
```bash
python summarize_api.py
# This will create the database in instance/app.db
```

### 6. Set Up and Run the Frontend
```bash
cd web-frontend
npm install
npm run dev
# Visit http://localhost:5173
```

### 7. Load the Chrome Extension
1. Open Chrome and go to `chrome://extensions`.
2. Enable "Developer mode".
3. Click "Load unpacked" and select `extension/chrome/dist`.

### 8. Demo Workflow
- Browse articles/videos in Chrome.
- Open the extension popup and export your list as JSON.
- In the web app, import the JSON file.
- Click "Auto-Summarize All" to generate summaries (requires LLM server running).
- View your profile/feed.

## Project Structure
```
share_reading_watch_lists/
├── extension/chrome/      # Chrome extension
├── web-frontend/          # React web app
├── llama_worker.py        # LLM summarization server
├── summarize_api.py       # Main backend API
├── requirements.txt       # Python dependencies
└── README.md
```

## Acknowledgments
- TinyLlama team for the lightweight LLM
- Flask, React, and Material-UI communities

---

**This README is strictly accurate as of the current state of the project. For questions or demo instructions, see the code or contact the authors.**
