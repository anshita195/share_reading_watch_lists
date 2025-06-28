document.addEventListener("DOMContentLoaded", async () => {
  // Username & password logic
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  function setLoggedIn(username) {
    chrome.storage.local.set({ username }, () => {
      usernameInput.value = username;
      passwordInput.value = '';
      passwordInput.style.display = 'none';
      loginBtn.style.display = 'none';
      logoutBtn.style.display = '';
    });
  }
  function setLoggedOut() {
    chrome.storage.local.remove(["username"], () => {
      usernameInput.value = '';
      passwordInput.value = '';
      passwordInput.style.display = '';
      loginBtn.style.display = '';
      logoutBtn.style.display = 'none';
    });
  }

  // On load, check if logged in
  chrome.storage.local.get(["username"], (result) => {
    if (result.username) {
      setLoggedIn(result.username);
    } else {
      setLoggedOut();
    }
  });

  loginBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedIn(username);
        alert("Logged in as " + username);
        location.reload();
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Login error: " + err);
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch("http://127.0.0.1:5000/logout", { method: "GET", credentials: "include" });
    } catch {}
    setLoggedOut();
    alert("Logged out");
    location.reload();
  });

  // Always show local tracked items, even if username is missing or backend is down
  chrome.storage.local.get(["trackedPages", "username"], async (result) => {
    let localItems = result.trackedPages || [];
    let backendItems = [];
    const username = result.username;
    let allItems = [...localItems];
    if (username) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/user/${encodeURIComponent(username)}/items`, { credentials: "include" });
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
      warning.textContent = 'Please log in to sync with the web app.';
      document.body.insertBefore(warning, document.body.firstChild);
    }
  });
});

chrome.runtime.onMessage.addListener((e, t, n) => {
  "PAGE_TRACKED" === e.type && location.reload();
});

//# sourceMappingURL=popup.js.map