# Share Reading & Watch Lists

Effortlessly track, summarize, and share your reading and watch history with a browser extension and web app.

---

## 🚀 Features
- **Browser Extension**: Automatically tracks articles and videos you visit
- **Export**: Download your tracked list as JSON
- **Web App**: Import and view your list, ready to share
- **Modern UI**: Built with React + Material-UI
- **Summarization**: (Planned) Summarize content using a local/self-hosted LLM

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd share_reading_watch_lists
```

### 2. Browser Extension (Chrome)
- Go to `extension/chrome/dist` (build if needed with `npm run build` in `extension/chrome`)
- Open Chrome and go to `chrome://extensions`
- Enable Developer Mode
- Click "Load unpacked" and select the `dist` folder

### 3. Web App
```sh
cd web-frontend
npm install
npm run dev
```
- Visit [http://localhost:5173](http://localhost:5173)

---

## 📝 Usage

### 1. **Track Content**
- Browse articles and videos as usual
- The extension will automatically track and categorize them

### 2. **Export Your List**
- Click the extension icon
- Click **Export List** to download your tracked content as `reading_watch_list.json`

### 3. **Import to Web App**
- Go to your Profile page in the web app
- Click **Import List** and select your exported JSON
- Your tracked articles and videos will appear instantly!

---

## 🤖 Summarization (Planned)
- The extension and web app are designed to support automatic content summarization
- **Planned integration:**
  - Use a local or self-hosted LLM (e.g., llama.cpp with TinyLlama or Gemma-3-1b)
  - Summaries will appear in your list after import/export
- For now, summaries are placeholders or blank

---

## 🌐 Social/Feed (Planned)
- The Feed page will show what others are reading/watching (mock data for now)
- Social features (following, sharing) are planned

---

## 📋 Project Structure
```
share_reading_watch_lists/
├── extension/         # Browser extension (Chrome)
├── web-frontend/      # React web app
└── README.md
```

---

## 👥 Team & Contributions
- Make regular, meaningful commits
- See issues or open a PR to contribute

---
