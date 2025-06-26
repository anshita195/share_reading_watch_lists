// Update stats and recent items when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  // Get tracked pages from storage
  const { trackedPages = [] } = await chrome.storage.local.get(['trackedPages']);
  
  // Update stats
  const articlesCount = trackedPages.filter(page => page.isArticle).length;
  const videosCount = trackedPages.filter(page => page.isVideo).length;
  
  document.getElementById('articles-count').textContent = articlesCount;
  document.getElementById('videos-count').textContent = videosCount;
  
  // Display recent items (last 5) that are articles or videos
  const filteredItems = trackedPages.filter(item => item.isArticle || item.isVideo);
  const recentItems = filteredItems.slice(-5).reverse();
  const recentItemsContainer = document.getElementById('recent-items');
  
  recentItemsContainer.innerHTML = recentItems.map(item => `
    <div class="item">
      <div class="item-title">${item.title}</div>
      <div class="item-url">${item.url}</div>
    </div>
  `).join('');
});

// Listen for updates from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_TRACKED') {
    // Refresh the popup data
    location.reload();
  }
});

// Export tracked data as JSON
function exportTrackedData() {
  chrome.storage.local.get(['trackedPages'], ({ trackedPages = [] }) => {
    // Only export articles or videos
    const filtered = trackedPages.filter(item => item.isArticle || item.isVideo);
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reading_watch_list.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportTrackedData);
  }
}); 