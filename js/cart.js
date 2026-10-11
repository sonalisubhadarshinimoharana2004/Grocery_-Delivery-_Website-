// Get cart data from localStorage
function readSavedCart() {
  try {
    const saved = localStorage.getItem("cart");
    const legacy = localStorage.getItem("grocery_cart");
    const parsed = JSON.parse(saved !== null ? saved : legacy || "[]");
    const items = Array.isArray(parsed) ? parsed : [];
    localStorage.setItem("cart", JSON.stringify(items));
    localStorage.removeItem("grocery_cart");
    return items.map((item) => ({
      ...item,
      quantity: Number(item.quantity || item.qty || 1),
    }));
  } catch {
    return [];
  }
}
let cart = readSavedCart();
cart = cart.map((item) => ({
  ...item,
  quantity: Number(item.quantity || item.qty || 1),
}));

const cartContainer = document.getElementById("cartContainer");
const totalContainer = document.getElementById("totalContainer");

// Display cart products
function displayCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `
            <div class="bg-white p-10 rounded-xl text-center">
                <h2 class="text-2xl font-bold">
                    Your cart is empty 🛒
                </h2>

                <a href="./index.html"
                   class="inline-block mt-5 bg-green-600 text-white
                          px-6 py-3 rounded-lg hover:bg-green-700">
                    Continue Shopping
                </a>
            </div>
        `;

    totalContainer.innerHTML = "";
    return;
  }

  cart.forEach((product, index) => {
    cartContainer.innerHTML += `
            <div class="bg-white p-4 rounded-xl mb-4
                        flex flex-wrap items-center gap-5 shadow-sm">

                <img
                    src="${product.image || ""}"
                    alt="${product.name || "Product"}"
                    class="w-24 h-24 object-contain"
                >

                <div class="flex-1 min-w-[120px]">
                    <h2 class="font-bold text-lg">
                        ${product.name}
                    </h2>

                    <p class="text-gray-500 text-sm mt-1">
                        Price: ₹${Number(product.price) || 0}
                    </p>

                    <p class="font-semibold mt-2">
                        Subtotal: ₹${
                          (Number(product.price) || 0) *
                          (Number(product.quantity) || 1)
                        }
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    <button
                        onclick="decrease(${index})"
                        class="border px-3 py-1 rounded hover:bg-gray-100"
                        aria-label="Decrease quantity">
                        −
                    </button>

                    <span class="font-semibold">
                        ${Number(product.quantity) || 1}
                    </span>

                    <button
                        onclick="increase(${index})"
                        class="border px-3 py-1 rounded hover:bg-gray-100"
                        aria-label="Increase quantity">
                        +
                    </button>
                </div>

                <button
                    onclick="removeProduct(${index})"
                    class="text-red-500 hover:text-red-700 font-semibold">
                    Remove
                </button>
            </div>
        `;
  });

  calculateTotal();
}

// Increase quantity
function increase(index) {
  if (!cart[index]) return;

  cart[index].quantity = (Number(cart[index].quantity) || 1) + 1;
  saveCart();
}

// Decrease quantity
function decrease(index) {
  if (!cart[index]) return;

  const quantity = Number(cart[index].quantity) || 1;

  if (quantity > 1) {
    cart[index].quantity = quantity - 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart();
}

// Remove product
function removeProduct(index) {
  if (index < 0 || index >= cart.length) return;

  cart.splice(index, 1);
  saveCart();
}

// Save cart and refresh the UI
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.removeItem("grocery_cart");
  const badge = document.getElementById("cartCount");
  const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  if (badge) {
    badge.textContent = String(count);
    badge.classList.toggle("hidden", count === 0);
  }
  window.dispatchEvent(new Event("cart:updated"));
  displayCart();
}

// Calculate total price
function calculateTotal() {
  const total = cart.reduce((sum, product) => {
    const price = Number(product.price) || 0;
    const quantity = Number(product.quantity) || 1;

    return sum + price * quantity;
  }, 0);

  totalContainer.innerHTML = `
        <div class="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹${total.toFixed(2)}</span>
        </div>

        <button
            onclick="goToCheckout()"
            class="w-full mt-5 bg-green-600 text-white
                   py-3 rounded-lg font-bold hover:bg-green-700">
            Proceed to Checkout
        </button>
    `;
}

// Proceed to checkout
function goToCheckout() {
  window.location.href = "./order.html";
}

// Re-read the canonical cart after browser Back/Forward restores this page.
window.addEventListener("pageshow", () => {
  cart = readSavedCart();
  displayCart();
});
window.addEventListener("storage", (event) => {
  if (event.key === "cart" || event.key === "grocery_cart") {
    cart = readSavedCart();
    displayCart();
  }
});

// Show cart when page loads
displayCart();
