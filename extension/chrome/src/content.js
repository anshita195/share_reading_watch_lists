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
  // Check for common video player elements
  const videoElements = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
  return videoElements.length > 0;
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