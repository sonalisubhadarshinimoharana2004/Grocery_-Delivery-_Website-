(() => {
  // Read the category slug from the URL query parameter

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("category") || "fruits";

  // Find the selected category from the central product data

  const category = (window.GROCERY_CATEGORIES || []).find(
    (item) => item.slug === slug,
  );

  // Get the main HTML elements used on this page

  const container = document.getElementById("productContainer");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");

  // If the requested category does not exist, show an error

  if (!category) {
    document.getElementById("categoryTitle").textContent = "Category not found";

    document.getElementById("categoryDescription").textContent =
      "Please choose a category from the home page.";

    // Provide a link to return to the home page

    container.innerHTML =
      '<a class="text-green-700 underline" href="./index.html">Return to home</a>';

    return;
  }

  // Set the browser tab title based on the selected category

  document.title = `${category.name} - Grocery Delivery`;

  // Display the category name and description

  document.getElementById("categoryTitle").textContent = category.name;

  document.getElementById("categoryDescription").textContent =
    category.description;

  //  READ CART DATA FROM LOCAL STORAGE

  function readCart() {
    try {
      // Convert the saved cart JSON string into a JavaScript array

      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  }

  // UPDATE CART ITEM COUNT

  function updateCartCount() {
    // Calculate the total quantity of all cart items

    const count = readCart().reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0,
    );

    const el = document.getElementById("cartCount");

    // Update the count only if the element exists

    if (el) {
      el.textContent = count;
      el.classList.toggle("hidden", count === 0);
    }
  }

  //  SHOW CART NOTIFICATION / TOAST MESSAGE

  function toast(message) {
    // Find an existing toast element
    let el = document.getElementById("cartToast");

    // Create the toast if it does not already exist
    if (!el) {
      el = document.createElement("div");
      el.id = "cartToast";

      el.className =
        "fixed bottom-5 right-5 z-[100] rounded-xl bg-gray-900 text-white px-5 py-3 shadow-lg opacity-0 translate-y-2 transition-all duration-200 pointer-events-none";

      el.setAttribute("role", "status");

      // Add the toast to the webpage
      document.body.appendChild(el);
    }

    // Display the confirmation message
    el.textContent = "✓ " + message;

    // Show the toast by removing hidden-state classes
    el.classList.remove("opacity-0", "translate-y-2");

    // Clear the previous timer before starting a new one
    clearTimeout(window.cartToastTimer);

    // Hide the toast after 1.8 seconds
    window.cartToastTimer = setTimeout(
      () => el.classList.add("opacity-0", "translate-y-2"),
      1800,
    );
  }

  // Add, increase or decrease product quantity; keep the UI synced with localStorage.
  let filteredProducts = category.products;
  function addToCart(productId) {
    const product = category.products.find(
      (item) => String(item.id) === String(productId),
    );
    if (!product) return;
    const cart = readCart();
    const existing = cart.find((item) => String(item.id) === String(productId));
    if (existing) existing.quantity = (Number(existing.quantity) || 1) + 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("grocery_cart");
    updateCartCount();
    window.dispatchEvent(new Event("cart:updated"));
    render(filteredProducts);
    toast(`${product.name} added to cart`);
  }
  function changeQuantity(productId, delta) {
    const cart = readCart();
    const item = cart.find((p) => String(p.id) === String(productId));
    if (!item && delta > 0) return addToCart(productId);
    if (!item) return;
    item.quantity = (Number(item.quantity) || 1) + delta;
    if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("grocery_cart");
    updateCartCount();
    window.dispatchEvent(new Event("cart:updated"));
    render(filteredProducts);
  }
  window.addToCart = addToCart;

  // Product cards show ADD until an item is in the cart, then +/- controls.
  function render(list) {
    container.innerHTML = "";
    emptyState.classList.toggle("hidden", list.length > 0);
    list.forEach((product) => {
      const article = document.createElement("article");
      article.className =
        "bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition";
      const image = product.image || category.image;
      article.innerHTML = `<img src="${image}" alt="" loading="lazy" class="w-full h-40 sm:h-48 object-contain rounded-lg"><p class="text-xs text-gray-500 mt-2">🕐 11 MINS</p><h2 class="font-semibold mt-2 min-h-12"></h2><p class="text-gray-500 text-sm"></p><div class="flex items-center justify-between gap-2 mt-4"><div><span class="font-bold price"></span> <span class="text-gray-400 line-through text-sm old-price"></span></div><div class="quantity-control"></div></div>`;
      article.querySelector("img").onerror = function () {
        this.onerror = null;
        this.src = category.image;
      };
      article.querySelector("h2").textContent = product.name;
      article.querySelector("p.text-gray-500.text-sm").textContent =
        product.unit || "";
      article.querySelector(".price").textContent = `₹${product.price}`;
      article.querySelector(".old-price").textContent = product.oldPrice
        ? `₹${product.oldPrice}`
        : "";
      const quantity = Number(
        (
          readCart().find((item) => String(item.id) === String(product.id)) ||
          {}
        ).quantity || 0,
      );
      const control = article.querySelector(".quantity-control");
      if (quantity > 0) {
        control.innerHTML = `<div class="flex items-center gap-3 bg-green-600 text-white rounded-lg px-2 py-1"><button type="button" class="qty-minus px-1 font-bold" aria-label="Decrease quantity">−</button><span class="font-semibold min-w-4 text-center">${quantity}</span><button type="button" class="qty-plus px-1 font-bold" aria-label="Increase quantity">+</button></div>`;
        control
          .querySelector(".qty-minus")
          .addEventListener("click", () => changeQuantity(product.id, -1));
        control
          .querySelector(".qty-plus")
          .addEventListener("click", () => changeQuantity(product.id, 1));
      } else {
        control.innerHTML = `<button type="button" class="border border-green-600 text-green-600 font-semibold px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">ADD</button>`;
        control
          .querySelector("button")
          .addEventListener("click", () => addToCart(product.id));
      }
      container.appendChild(article);
    });
  }

  const initialSearch =
    new URLSearchParams(window.location.search).get("search") || "";
  if (searchInput) searchInput.value = initialSearch;
  filteredProducts = initialSearch
    ? category.products.filter((p) =>
        p.name.toLowerCase().includes(initialSearch.toLowerCase()),
      )
    : category.products;
  if (searchInput)
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.trim().toLowerCase();
      filteredProducts = category.products.filter((p) =>
        p.name.toLowerCase().includes(term),
      );
      render(filteredProducts);
    });

  // Initial render. Back/Forward must preserve cart data and refresh quantity UI.
  render(filteredProducts);
  updateCartCount();
  window.addEventListener("pageshow", () => {
    render(filteredProducts);
    updateCartCount();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "cart" || event.key === "grocery_cart") {
      render(filteredProducts);
      updateCartCount();
    }
  });
})();
