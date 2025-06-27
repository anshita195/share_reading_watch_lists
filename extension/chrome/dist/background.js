console.log('Background script loaded!');

// Initialize WebLLM and load Gemma model

let model = null;

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
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Tab activated:', activeInfo);
});

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
      const type = pageData.url.includes('youtube.com') ? 'video' : 'article';

      console.log('About to fetch', pageData);
      fetch('http://127.0.0.1:5000/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pageData.title,
          url: pageData.url,
          type: type
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
        console.error('Error sending to backend:', error);
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
    // Send to Flask API
    fetch('http://127.0.0.1:5000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: pageData.title,
        url: pageData.url,
        type: pageData.isVideo ? 'video' : 'article'
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Successfully sent to backend (onMessage):', data);
    })
    .catch(error => {
      console.error('Error sending to backend (onMessage):', error);
    });

    chrome.storage.local.get(['trackedPages'], (result) => {
      const trackedPages = result.trackedPages || [];
      trackedPages.push(pageData);
      chrome.storage.local.set({ trackedPages }, () => {
        // Optionally notify popup to refresh
        chrome.runtime.sendMessage({ type: 'PAGE_TRACKED' });
      });
    });
  }
});

// Initialize when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  initializeLLM();
  chrome.storage.local.set({ trackedPages: [] });
});

// Debug/test function to manually POST to backend from console (for service worker context)
self.testBackend = function() {
  fetch('http://127.0.0.1:5000/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test from console',
      url: 'http://example.com',
      type: 'article'
    }),
  })
  .then(r => r.json())
  .then(d => console.log('Test POST result:', d))
  .catch(e => console.error('Test POST error:', e));
};

//# sourceMappingURL=background.js.map