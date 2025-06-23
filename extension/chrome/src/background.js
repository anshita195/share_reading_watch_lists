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

// Track page visits
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      // Get page content
      const [results] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          return {
            title: document.title,
            url: window.location.href,
            content: document.body.innerText,
            timestamp: new Date().toISOString()
          };
        }
      });

      const pageData = results.result;
      
      // Store the data
      chrome.storage.local.get(['trackedPages'], (result) => {
        const trackedPages = result.trackedPages || [];
        trackedPages.push(pageData);
        chrome.storage.local.set({ trackedPages });
      });

      // TODO: Process content with LLM
      // This will be implemented when we add the WebLLM integration
      
    } catch (error) {
      console.error('Error tracking page:', error);
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_LOADED' && message.data) {
    const pageData = message.data;
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