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
    document.getElementById("categoryTitle").textContent =
      "Category not found";

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

    if (el) el.textContent = count;
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


  //  ADD PRODUCT TO CART

  function addToCart(productId) {

    // Find the selected product inside the current category
    const product = category.products.find(
      (item) => String(item.id) === String(productId),
    );

    if (!product) return;

    const cart = readCart();
    const existing = cart.find(
      (item) => String(item.id) === String(productId)
    );

    if (existing) {

      // Increase quantity if the product already exists
      existing.quantity =
        (Number(existing.quantity) || 1) + 1;

    } else {

      // Add a new product with an initial quantity of 1
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    toast(`${product.name} added to cart`);
  }

  window.addToCart = addToCart;

  //  RENDER / DISPLAY PRODUCT CARDS

  function render(list) {

    container.innerHTML = "";

    emptyState.classList.toggle("hidden", list.length > 0);

    // Create and display a card for each product
    list.forEach((product) => {

      const article = document.createElement("article");

      article.className =
        "bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition";

      const image = product.image || category.image;

      article.innerHTML = `<img src="${image}" alt="" loading="lazy" class="w-full h-40 sm:h-48 object-contain rounded-lg" onerror="this.onerror=null;this.src='${category.image}'"><p class="text-xs text-gray-500 mt-2">🕐 11 MINS</p><h2 class="font-semibold mt-2 min-h-12"></h2><p class="text-gray-500 text-sm"></p><div class="flex items-center justify-between gap-2 mt-4"><div><span class="font-bold price"></span> <span class="text-gray-400 line-through text-sm old-price"></span></div><button type="button" class="border border-green-600 text-green-600 font-semibold px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white">ADD</button></div>`;

      article.querySelector("h2").textContent = product.name;
      article.querySelector("p.text-gray-500.text-sm").textContent = product.unit || "";
      article.querySelector(".price").textContent = `₹${product.price}`;
      article.querySelector(".old-price").textContent = product.oldPrice
        ? `₹${product.oldPrice}`
        : "";

      // Add a click event to the ADD button
      // The selected product ID is passed to addToCart()
      article
        .querySelector("button")
        .addEventListener("click", () => addToCart(product.id));

      // Append the completed product card to the page
      container.appendChild(article);
    });
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();

    render(
      category.products.filter((p) =>
        p.name.toLowerCase().includes(term)
      ),
    );
  });

  // INITIAL PAGE LOAD

  // Display all products belonging to the selected category
  render(category.products);

  // Show the current total quantity in the cart
  updateCartCount();

})();