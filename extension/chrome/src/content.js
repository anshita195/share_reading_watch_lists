// Content script to handle page content extraction
console.log('Reading & Watch List Tracker content script loaded');

// Function to extract main content from the page
function extractMainContent() {
  // Try to find the main content area
  const mainContent = document.querySelector('main, article, [role="main"], .main-content, #main-content');
  
  if (mainContent) {
    return mainContent.innerText;
  }
  
  // Fallback to body content
  return document.body.innerText;
}

// Function to determine if the page is a video
function isVideoPage() {
  // Check for <video> tags
  const videoElements = document.querySelectorAll('video');
  if (videoElements.length > 0) return true;

  // Check for common video platforms in URL
  const videoPlatforms = [
    'youtube.com/watch',
    'youtu.be/',
    'vimeo.com/',
    'dailymotion.com/video',
    'twitch.tv/videos',
    'facebook.com/watch',
    'bilibili.com/video',
    'netflix.com/watch',
    'primevideo.com/detail',
    'hotstar.com',
    'zee5.com',
    'mxplayer.in',
    'sonyliv.com',
    'disneyplus.com',
    'hulu.com/watch',
    'hbomax.com',
    'crunchyroll.com/watch'
  ];
  if (videoPlatforms.some(platform => window.location.href.includes(platform))) return true;

  // Check for Open Graph video meta tag
  const ogVideo = document.querySelector('meta[property="og:video"]');
  if (ogVideo) return true;

  // Check for embedded iframes from video platforms
  const iframeSelectors = [
    'iframe[src*="youtube.com/embed"]',
    'iframe[src*="player.vimeo.com"]',
    'iframe[src*="dailymotion.com/embed"]',
    'iframe[src*="twitch.tv"]',
    'iframe[src*="facebook.com/plugins/video"]'
  ];
  for (const selector of iframeSelectors) {
    if (document.querySelector(selector)) return true;
  }

  return false;
}

// Function to determine if the page is an article
function isArticlePage() {
  // Check for common article indicators
  const articleElements = document.querySelectorAll('article, [role="article"], .article, .post, .blog-post');
  return articleElements.length > 0;
}

// Send page information to background script
chrome.runtime.sendMessage({
  type: 'PAGE_LOADED',
  data: {
    url: window.location.href,
    title: document.title,
    isVideo: isVideoPage(),
    isArticle: isArticlePage(),
    content: extractMainContent(),
    timestamp: new Date().toISOString()
  }
});

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Re-run detection and send message again
    chrome.runtime.sendMessage({
      type: 'PAGE_LOADED',
      data: {
        url: window.location.href,
        title: document.title,
        isVideo: isVideoPage(),
        isArticle: isArticlePage(),
        content: extractMainContent(),
        timestamp: new Date().toISOString()
      }
    });
  }
}).observe(document, {subtree: true, childList: true}); 