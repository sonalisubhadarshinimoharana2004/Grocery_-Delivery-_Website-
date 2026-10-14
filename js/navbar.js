(() => {
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const user = read("loggedInUser", null);
  const header = document.createElement("header");
  header.id = "siteNavbar";
  header.className = "bg-white border-b border-gray-200 sticky top-0 z-50";

  header.innerHTML = `
    <div class="max-w-[1320px] mx-auto px-4 lg:px-6"><div class="min-h-[78px] py-3 flex flex-nowrap items-center gap-3 md:gap-5">
      
    <a href="./index.html" class="min-w-[112px] shrink-0 flex items-center justify-center border-r border-gray-100 pr-5" aria-label="Blinkit home"><h1 class="text-[29px] leading-none font-extrabold tracking-[-1.8px]"><span class="text-[#f8c529]">blink</span><span class="text-[#249b45]">it</span></h1></a>
      <div class="hidden md:block min-w-[190px] shrink-0 cursor-pointer"><p class="text-sm font-bold leading-5">Delivery in 10 minutes</p><p class="font-normal text-sm text-gray-600 max-w-[190px] truncate">${(user && user.address ? String(user.address).split(",").slice(-2).join(",").trim() : "Bhubaneswar").replace(/[<>]/g, "")}</p></div>
      <div class="flex-1 min-w-[180px] relative"><img src="./Assets/search.png" alt="" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"/><input id="searchInput" type="search" placeholder="Search for products, brands and more" aria-label="Search products" class="w-full bg-[#f7f7f7] rounded-xl py-3.5 pl-12 pr-5 outline-none border border-[#eeeeee] focus:border-green-500"/></div>
      
      <div class="relative shrink-0">
        <a id="navLoginLink" href="./login.html" class="text-gray-800 font-semibold px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap ${user ? "hidden" : ""}">Login</a>
        
        <button id="accountBtn" type="button" aria-expanded="false" aria-controls="accountMenu" class="text-gray-800 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap items-center gap-2 ${user ? "flex" : "hidden"}"><span>Account</span><span aria-hidden="true">▾</span></button>
        <div id="accountMenu" class="hidden absolute right-0 top-full mt-3 w-72 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden text-left">
          
        <div class="px-5 py-4 border-b border-gray-100"><p class="font-bold text-lg">My Account</p><p class="text-sm text-gray-500 mt-1">${((user && (user.phone || user.email)) || "Manage your account").toString().replace(/[<>]/g, "")}</p></div>
          
        <nav class="py-2" aria-label="Account menu"><a href="./account.html#profile" class="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-700">👤 <span>My Profile</span></a><a href="./my-orders.html" class="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-700">📦 <span>My Orders</span></a><a href="./account.html#address" class="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 hover:text-green-700">📍 <span>Saved Addresses</span></a></nav>
          
        <div class="border-t border-gray-100 p-3"><button id="logoutBtn" type="button" class="w-full text-left rounded-xl px-3 py-3 text-red-600 font-semibold hover:bg-red-50">↪ Log out</button></div>
        </div>

      </div>
      <a href="./cart.html" class="bg-[#0c831f] text-white rounded-xl px-4 py-3 font-semibold flex items-center gap-2 hover:bg-green-800 whitespace-nowrap min-h-[48px]"><img src="./Assets/shopping-cart.png" alt="" class="h-5 w-5 brightness-0 invert"/><span>My Cart</span><span id="cartCount" class="bg-white text-[#0c831f] text-xs px-2 py-1 rounded-full">0</span></a>
    </div>
    </div>`;


  const oldHeader = document.querySelector("header");
  if (oldHeader) oldHeader.replaceWith(header);
  else document.body.insertBefore(header, document.body.firstChild);
  
  // Keep Back outside the navbar on content pages only; the home page stays clean.
  const currentFile = location.pathname.split("/").pop() || "index.html";
  if (currentFile !== "index.html" && currentFile !== "") {
    const backBar = document.createElement("div");
    backBar.className = "max-w-[1320px] mx-auto px-4 lg:px-6 pt-4";
    backBar.innerHTML =
      '<button id="pageBackBtn" type="button" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-green-500 hover:text-green-700" aria-label="Go to previous page"><span aria-hidden="true">←</span> Back</button>';
    header.insertAdjacentElement("afterend", backBar);
    backBar.querySelector("#pageBackBtn").addEventListener("click", () => {
      const sameSiteReferrer =
        document.referrer &&
        new URL(document.referrer).origin === location.origin;
      if (history.length > 1 && sameSiteReferrer) history.back();
      else location.href = "./index.html";
    });
  }
  const accountBtn = header.querySelector("#accountBtn"),
    menu = header.querySelector("#accountMenu");
  accountBtn?.addEventListener("click", () => {
    const open = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !open);
    accountBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (
      menu &&
      accountBtn &&
      !menu.contains(e.target) &&
      !accountBtn.contains(e.target)
    ) {
      menu.classList.add("hidden");
      accountBtn.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu?.classList.add("hidden");
      accountBtn?.setAttribute("aria-expanded", "false");
    }
  });

header.querySelector("#logoutBtn")?.addEventListener("click", () => {
    if (document.getElementById("logoutConfirmModal")) return;

    const modal = document.createElement("div");

    modal.id = "logoutConfirmModal";
    modal.className =
        "fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4";

    modal.innerHTML = `
        <div role="dialog" aria-modal="true"
             class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

            <h2 class="text-xl font-bold text-gray-900">
                Are you sure to logout?
            </h2>

            <p class="mt-2 text-sm text-gray-600">
                Do you want to log out of your account?
            </p>

            <div class="mt-6 flex justify-end gap-3">
                <button id="cancelLogoutBtn" type="button"
                    class="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold">
                    Cancel
                </button>

                <button id="confirmLogoutBtn" type="button"
                    class="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white">
                    Sure
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();

    modal.querySelector("#cancelLogoutBtn")
        .addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
    });

    modal.querySelector("#confirmLogoutBtn")
        .addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            localStorage.setItem("cart", "[]");
            localStorage.removeItem("grocery_cart");

            location.href = "./index.html";
        });

    modal.querySelector("#cancelLogoutBtn").focus();
});

  const input = header.querySelector("#searchInput");
  if (input) {
    const params = new URLSearchParams(location.search);
    if (params.get("search")) input.value = params.get("search");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim())
        location.href = `./category.html?search=${encodeURIComponent(input.value.trim())}`;
    });
  }
  const cart = read("cart", read("grocery_cart", []));
  const badge = header.querySelector("#cartCount");
  const refreshCartBadge = () => {
    const items = read("cart", []);
    const count = Array.isArray(items)
      ? items.reduce(
          (sum, item) =>
            sum + Math.max(0, Number(item.quantity || item.qty || 0)),
          0,
        )
      : 0;
    if (badge) {
      badge.textContent = String(count);
      badge.classList.toggle("hidden", count === 0);
      badge.setAttribute("aria-label", `${count} items in cart`);
    }
  };
  // Migrate any older saved cart format once, then use `cart` as the only key.
  if (!localStorage.getItem("cart") && Array.isArray(cart) && cart.length)
    localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.removeItem("grocery_cart");
  refreshCartBadge();
  window.addEventListener("storage", refreshCartBadge);
  window.addEventListener("pageshow", refreshCartBadge);
  window.addEventListener("cart:updated", refreshCartBadge);
})();