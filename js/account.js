(() => {
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const user = read("loggedInUser", null);
  const navLink = document.getElementById("navAccountLink");
  if (navLink) {
    navLink.textContent = user ? "Account" : "Login";
    navLink.href = user ? "./account.html" : "./login.html";
    navLink.title = user ? "Open your account" : "Log in";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn)
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });

  if (document.getElementById("profileName")) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }
    const put = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value || "Not provided";
    };
    put("profileName", user.name);
    put("profilePhone", user.phone);
    put("profileEmail", user.email);
    const savedAddress =
      user.address || localStorage.getItem("deliveryAddress") || "";
    put("profileAddress", savedAddress || "No address saved yet");
  }
})();