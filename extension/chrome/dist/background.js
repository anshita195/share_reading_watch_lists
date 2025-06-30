console.log('Background script loaded!');

// Initialize WebLLM and load Gemma model

let model = null;
let recentTracked = {}; // url: timestamp
const TRACK_DEDUP_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

const VIDEO_SITES = ['youtube.com', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
const SEARCH_ENGINES = ['google.com', 'bing.com', 'duckduckgo.com', 'yahoo.com', 'baidu.com', 'yandex.ru'];

async function initializeLLM() {
  try {
    // TODO: Initialize WebLLM with Gemma-3-1b
    // This will be implemented when we add the WebLLM integration
    console.log('LLM initialization will be implemented');
  } catch (error) {
    console.error('Failed to initialize LLM:', error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated!');
  initializeLLM();
  chrome.storage.local.set({ trackedPages: [] });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo);
});

function isValidPageData(pageData, username) {
  return (
    pageData &&
    typeof pageData.title === 'string' && pageData.title.trim() !== '' &&
    typeof pageData.url === 'string' && pageData.url.trim() !== '' &&
    typeof username === 'string' && username.trim() !== ''
  );
}

function shouldTrack(url, title) {
  const now = Date.now();
  if (recentTracked[url] && now - recentTracked[url] < TRACK_DEDUP_WINDOW_MS) {
    return { track: false, type: null };
  }

  try {
    const urlObject = new URL(url);
    const hostname = urlObject.hostname.replace(/^www\./, '');

    // Don't track search engine results pages
    if (SEARCH_ENGINES.some(engine => hostname.includes(engine)) && (urlObject.pathname.includes('/search') || urlObject.pathname.includes('/search.php'))) {
      return { track: false, type: null };
    }
    
    // Check for video sites
    if (VIDEO_SITES.some(site => hostname.includes(site))) {
      recentTracked[url] = now;
      return { track: true, type: 'video' };
    }
    
    // Check title length for articles - simple heuristic
    // Ignore short titles, likely not articles
    const titleWords = title.trim().split(/\s+/);
    if (titleWords.length > 4) {
       recentTracked[url] = now;
       return { track: true, type: 'article' };
    }

    return { track: false, type: null };

  } catch (e) {
    console.error("Error parsing URL for tracking:", e);
    return { track: false, type: null };
  }
}

// Track page visits
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    console.log('onUpdated fired:', tabId, changeInfo, tab);
    if (
      changeInfo.status === 'complete' &&
      tab.url &&
      !tab.url.startsWith('chrome://') &&
      !tab.url.startsWith('chrome-extension://')
    ) {
      console.log('About to executeScript');
      const [results] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => ({
          title: document.title,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      });
      console.log('Script executed, results:', results);
      const pageData = results.result;
      
      const { track, type } = shouldTrack(pageData.url, pageData.title);
      
      if (!track) {
        console.log('Skipping track based on URL/title:', pageData.url);
        return;
      }
      
      console.log('About to fetch', pageData);
      chrome.storage.local.get(['username', 'trackedPages'], (result) => {
        const username = result.username;
        if (!isValidPageData(pageData, username)) {
          console.warn('Invalid page data or username, skipping:', pageData, username);
          return;
        }
        // Try backend first
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
        .then(response => {
          console.log('Fetch response:', response);
          return response.json();
        })
        .then(data => {
          console.log('Successfully sent to backend:', data);
        })
        .catch(error => {
          console.error('Error sending to backend, saving locally:', error);
          // Save locally if backend fails
          const trackedPages = result.trackedPages || [];
          trackedPages.push({ ...pageData, type });
          chrome.storage.local.set({ trackedPages }, () => {
            chrome.runtime.sendMessage({ type: 'PAGE_TRACKED' });
          });
        });
      });
    }
  } catch (error) {
    console.error('Error in onUpdated handler:', error);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_LOADED' && message.data) {
    const pageData = message.data;
    chrome.storage.local.get(['username', 'trackedPages'], (result) => {
      const username = result.username;
      const { track, type } = shouldTrack(pageData.url, pageData.title);

      if (!track) {
        console.log('Skipping track from message based on URL/title:', pageData.url);
        return;
      }

      if (!isValidPageData(pageData, username)) {
        console.warn('Invalid page data or username, skipping:', pageData, username);
        return;
      }

      // Try backend first
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
      .then(response => response.json())
      .then(data => {
        console.log('Successfully sent to backend (onMessage):', data);
      })
      .catch(error => {
        console.error('Error sending to backend (onMessage), saving locally:', error);
        // Save locally if backend fails
        const trackedPages = result.trackedPages || [];
        trackedPages.push({ ...pageData });
        chrome.storage.local.set({ trackedPages }, () => {
          chrome.runtime.sendMessage({ type: 'PAGE_TRACKED' });
        });
      });
    });
  }
});

// Debug/test function to manually POST to backend from console (for service worker context)
self.testBackend = function() {
  chrome.storage.local.get(['username'], (result) => {
    const username = result.username;
    if (!username) {
      console.error('No username set in extension storage!');
      return;
    }
    fetch('http://localhost:5000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test from console',
        url: 'http://example.com',
        type: 'article',
        username: username
      }),
    })
    .then(r => r.json())
    .then(d => console.log('Test POST result:', d))
    .catch(e => console.error('Test POST error:', e));
  });
};

//# sourceMappingURL=background.js.map