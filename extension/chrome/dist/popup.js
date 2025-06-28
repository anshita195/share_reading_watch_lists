document.addEventListener("DOMContentLoaded", async () => {
  // Username logic
  const usernameInput = document.getElementById("username-input");
  const saveUsernameBtn = document.getElementById("save-username-btn");
  // Load username if set
  chrome.storage.local.get(["username"], (result) => {
    if (result.username) {
      usernameInput.value = result.username;
    }
  });
  saveUsernameBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (username) {
      chrome.storage.local.set({ username }, () => {
        saveUsernameBtn.textContent = "Saved!";
        setTimeout(() => {
          saveUsernameBtn.textContent = "Save";
        }, 1000);
      });
    }
  });

  // Always show local tracked items, even if username is missing or backend is down
  chrome.storage.local.get(["trackedPages", "username"], async (result) => {
    let localItems = result.trackedPages || [];
    let backendItems = [];
    const username = result.username;
    let allItems = [...localItems];
    if (username) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user/${encodeURIComponent(username)}/items`);
        if (res.ok) {
          backendItems = await res.json();
          // Merge by URL (deduplicate)
          allItems = [...localItems, ...backendItems].reduce((acc, item) => {
            if (!acc.some(i => i.url === item.url)) acc.push(item);
            return acc;
          }, []);
        }
      } catch (err) {
        // Backend unavailable, fallback to local only
      }
    }
    const articles = allItems.filter(e => e.type === 'article' || e.isArticle);
    const videos = allItems.filter(e => e.type === 'video' || e.isVideo);
    document.getElementById("articles-count").textContent = articles.length;
    document.getElementById("videos-count").textContent = videos.length;
    const recent = allItems.filter(e => e.type === 'article' || e.type === 'video' || e.isArticle || e.isVideo).slice(-5).reverse();
    document.getElementById("recent-items").innerHTML = recent.map(e => `
      <div class="item">
        <div class="item-title">${e.title}</div>
        <div class="item-url">${e.url}</div>
      </div>
    `).join("");
    if (!username) {
      const warning = document.createElement('div');
      warning.style.color = 'red';
      warning.style.margin = '10px 0';
      warning.textContent = 'Please enter your username to sync with the web app.';
      document.body.insertBefore(warning, document.body.firstChild);
    }
  });
});

chrome.runtime.onMessage.addListener((e, t, n) => {
  "PAGE_TRACKED" === e.type && location.reload();
});

//# sourceMappingURL=popup.js.map