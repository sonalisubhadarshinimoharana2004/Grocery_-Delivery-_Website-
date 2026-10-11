(() => {
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  // Account form behavior only. The shared navbar owns its own dropdown and logout.
  const logoutButton = document.getElementById("accountPageLogout");
  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "./index.html";
  });

  const profileForm = document.getElementById("profileForm");
  if (!profileForm) return;

  let user = read("loggedInUser", null);
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const nameInput = document.getElementById("profileNameInput");
  const phoneInput = document.getElementById("profilePhoneInput");
  const emailInput = document.getElementById("profileEmailInput");
  const addressInput = document.getElementById("profileAddressInput");
  nameInput.value = user.name || "";
  phoneInput.value = user.phone || "";
  emailInput.value = user.email || "";
  addressInput.value =
    user.address || localStorage.getItem("deliveryAddress") || "";

  const message = (id, text, ok = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.className = "text-sm " + (ok ? "text-green-700" : "text-red-600");
  };

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      message("profileMessage", "Enter a valid 10-digit mobile number.", false);
      return;
    }
    const users = read("users", []);
    const oldEmail = String(user.email || "").toLowerCase();
    const duplicate = users.some(
      (u) =>
        String(u.email || "").toLowerCase() === email &&
        String(u.email || "").toLowerCase() !== oldEmail,
    );
    if (duplicate) {
      message(
        "profileMessage",
        "This email is already used by another account.",
        false,
      );
      return;
    }
    const updated = { ...user, name: nameInput.value.trim(), phone, email };
    localStorage.setItem("loggedInUser", JSON.stringify(updated));
    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((u) =>
          String(u.email || "").toLowerCase() === oldEmail
            ? { ...u, ...updated }
            : u,
        ),
      ),
    );
    user = updated;
    message("profileMessage", "Profile saved successfully.");
  });

  document
    .getElementById("addressForm")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const address = addressInput.value.trim();
      if (!address) {
        message("addressMessage", "Please enter your delivery address.", false);
        return;
      }
      user = { ...user, address };
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("deliveryAddress", address);
      const users = read("users", []);
      localStorage.setItem(
        "users",
        JSON.stringify(
          users.map((u) =>
            String(u.email || "").toLowerCase() ===
            String(user.email || "").toLowerCase()
              ? { ...u, address }
              : u,
          ),
        ),
      );
      message("addressMessage", "Delivery address saved successfully.");
    });
})();
