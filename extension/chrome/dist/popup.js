document.addEventListener("DOMContentLoaded", async () => {
  const loginStatusDiv = document.getElementById("login-status");
  const logoutBtn = document.getElementById("logout-btn");
  const loginLinkBtn = document.getElementById("login-link-btn");
  
  const setLoggedInUI = (username) => {
    loginStatusDiv.textContent = `Logged in as: ${username}`;
    loginStatusDiv.className = 'logged-in';
    logoutBtn.style.display = '';
    loginLinkBtn.style.display = 'none';
  };

  const setLoggedOutUI = () => {
    loginStatusDiv.textContent = 'You are not logged in.';
    loginStatusDiv.className = 'logged-out';
    logoutBtn.style.display = 'none';
    loginLinkBtn.style.display = '';
    // Clear stats and recent items when logged out
    document.getElementById("articles-count").textContent = '0';
    document.getElementById("videos-count").textContent = '0';
    document.getElementById("recent-items").innerHTML = 'Please log in on the web app to see your items.';
  };

  const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:5000/session", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.logged_in && data.username) {
          chrome.storage.local.set({ username: data.username });
          setLoggedInUI(data.username);
          updateTrackedItems(data.username);
        } else {
          chrome.storage.local.remove("username");
          setLoggedOutUI();
        }
      } else {
        throw new Error('Session check failed');
      }
    } catch (err) {
      chrome.storage.local.remove("username");
      setLoggedOutUI();
      loginStatusDiv.textContent = 'Error connecting to server.';
    }
  };

  const updateTrackedItems = async (username) => {
    try {
      const res = await fetch(`http://localhost:5000/user/${encodeURIComponent(username)}/items`, { credentials: "include" });
      if (res.ok) {
        const items = await res.json();
        const articles = items.filter(e => e.type === 'article');
        const videos = items.filter(e => e.type === 'video');
        document.getElementById("articles-count").textContent = articles.length;
        document.getElementById("videos-count").textContent = videos.length;
        const recent = items.slice(-5).reverse();
        document.getElementById("recent-items").innerHTML = recent.length > 0 ? recent.map(e => `
          <div class="item">
            <div class="item-title">${e.title}</div>
            <div class="item-url">${e.url}</div>
          </div>
        `).join("") : 'No items tracked yet.';
      } else {
        document.getElementById("recent-items").innerHTML = 'Could not load items.';
      }
    } catch (err) {
      document.getElementById("recent-items").innerHTML = 'Error loading items.';
    }
  };

  loginLinkBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:5173/login' });
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch("http://localhost:5000/logout", { method: "GET", credentials: "include" });
    } catch {}
    chrome.storage.local.remove("username");
    setLoggedOutUI();
    // No need to reload, just update UI
  });
  
  // Initial check when popup opens
  checkSession();
});

chrome.runtime.onMessage.addListener((e, t, n) => {
  // If a page is tracked while popup is open, refresh the items
  if ("PAGE_TRACKED" === e.type) {
    chrome.storage.local.get(["username"], (result) => {
      if(result.username) updateTrackedItems(result.username);
    });
  }
});

//# sourceMappingURL=popup.js.map