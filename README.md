# Share Reading & Watch Lists

Forget less, learn more. This project is a website and browser extension that automatically logs your watched videos and read articles, then uses a local LLM to summarize and store them, creating a public showcase of your intellectual footprint.

## Why is this different?

While many tools like Notion or Substack can be used to manually curate content, this project is built on the principle of **zero manual input**. It acts as an automated, intelligent layer on top of your browsing, creating a rich, shareable profile of your intellectual journey without any extra effort. All processing happens **locally**, ensuring your data remains private.

## 🚀 Core Features

- **Automated Tracking**: A browser extension intelligently tracks articles and videos in the background.
- **Local LLM Summarization**: Uses a locally-run language model (via `llama.cpp`) to generate concise summaries. No external API keys needed.
- **Public Profiles & Feed**: Share your reading list and follow other users to see what they're consuming.
- **Full User Control**: Secure user accounts with the ability to delete any tracked item.
- **Seamless Login**: Session is synchronized between the web app and the browser extension.
- **Duplicate Prevention**: Intelligently identifies and ignores duplicate content, even with different URL parameters (e.g., YouTube timestamps).

## 🛠️ Setup & Installation

This project consists of three main parts that need to be set up: the **Backend**, the **Frontend**, and the **Chrome Extension**.

### Prerequisites

- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js 16+](https://nodejs.org/) (which includes `npm`)
- A C++ compiler (required by `llama-cpp-python` for building the model engine).
  - **Windows**: Install [Visual Studio with C++ development tools](https://visualstudio.microsoft.com/downloads/).
  - **macOS**: Install Xcode Command Line Tools (`xcode-select --install`).
  - **Linux**: Install a C++ compiler via your package manager (e.g., `sudo apt-get install build-essential`).

### 1. Backend & LLM Setup

The backend consists of two servers: the main API and the LLM worker.

**a. Clone the repository:**

```bash
git clone <repository_url> && cd share_reading_watch_lists
```

**b. Set up a Python virtual environment:**

```bash
# Create a virtual environment
python -m venv venv

# Activate it
# Windows
venv\\Scripts\\activate
# macOS/Linux
source venv/bin/activate
```

**c. Install Python dependencies:**

```bash
pip install -r requirements.txt
```

*(Note: If you don't have a `requirements.txt` file, you can create one or install packages manually: `pip install Flask Flask-Cors Flask-SQLAlchemy Werkzeug requests llama-cpp-python`)*

**d. Download the Language Model:**

This project requires a local language model in `GGUF` format.

- **Download this recommended model**: [TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf](https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf) (~637 MB)
- **Place the downloaded `.gguf` file** in the project's root directory.
- **Ensure the filename matches** the `MODEL_PATH` in `llama_worker.py`.

### 2. Frontend Setup

In a new terminal, navigate to the `web-frontend` directory and install the dependencies.

```bash
cd web-frontend && npm install
```

### 3. Chrome Extension Setup

The extension is pre-built in the `extension/chrome/dist` folder. You just need to load it into Chrome.

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable **"Developer mode"** using the toggle in the top-right corner.
3.  Click the **"Load unpacked"** button.
4.  Select the `extension/chrome/dist` folder from this project.
5.  The extension should now appear in your browser's toolbar.

## 📖 How to Run for Testing

You need to have **three separate terminals** running simultaneously.

**1. Start the LLM Worker:**
In your first terminal (with the Python virtual environment activated):

```bash
python llama_worker.py
```
*(Wait for the "Model loaded successfully" message.)*

**2. Start the Main Backend API & Initialize Database:**
In a second terminal (with the Python virtual environment activated):

```bash
python summarize_api.py
```
*(This will create the `instance/app.db` file on its first run.)*

**3. Start the Frontend:**
In your third terminal (from the `web-frontend` directory):

```bash
npm run dev
```
You can now access the web application at **http://localhost:5173**. Register a user and start browsing!

## 💡 Assumptions & Future Work

### Assumptions
- The application is run on a local machine, not a production server.
- The user's machine has sufficient RAM (~4GB free) to load the language model.
- The LLM and prompts are optimized for content in English.

### Potential Future Features
- **True Article Scraping**: Instead of summarizing based on title alone, the backend could scrape the text content of articles for vastly improved summary quality.
- **Video Transcript Summarization**: For platforms like YouTube, fetch the video transcript to provide an actual summary of the video's content.
- **Smarter Content Filtering**: Use the LLM to perform an initial "quality check" on content *before* it's tracked to filter out low-value pages automatically.
- **Batch Summarization**: A "Summarize All" button on the profile page to process any items that were tracked while the LLM worker was offline.
- **Cloud Deployment Guide**: Instructions for deploying the application to a cloud service for a publicly hosted version, potentially with a more powerful GPU-backed LLM.

## 🔧 Project Structure

```
share_reading_watch_lists/
├── extension/chrome/dist/    # Pre-built Chrome extension files
├── web-frontend/             # React web application source
├── instance/                 # SQLite database storage
├── venv/                     # Python virtual environment
├── llama_worker.py           # Local LLM server (summarization)
├── summarize_api.py          # Main Flask API (auth, data)
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

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
