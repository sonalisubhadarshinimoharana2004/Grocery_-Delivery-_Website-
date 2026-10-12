// Require a signed-in customer before checkout
const activeUser = JSON.parse(
  localStorage.getItem("loggedInUser") || "null"
);

if (!activeUser) {
  window.location.href = "login.html";
}

// Get cart from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderSummary = document.getElementById("orderSummary");
const orderTotal = document.getElementById("orderTotal");

function showCheckoutMessage(message, success) {
  const box = document.getElementById("checkoutMessage");

  if (!box) return;

  box.textContent = message;
  box.className = `rounded-xl p-3 mb-5 text-sm ${
    success
      ? "bg-green-50 text-green-800"
      : "bg-amber-50 text-amber-800"
  }`;
}

// Display cart products and total
function displayOrder() {
  if (!orderSummary || !orderTotal) return;

  orderSummary.innerHTML = "";

  if (cart.length === 0) {
    orderSummary.innerHTML = `
      <p class="text-center text-gray-500">
        Your cart is empty 🛒
      </p>
    `;

    orderTotal.innerText = "0";
    return;
  }

  let total = 0;

  cart.forEach((product) => {
    const itemTotal =
      Number(product.price) * Number(product.quantity);

    total += itemTotal;

    orderSummary.innerHTML += `
      <div class="flex items-center justify-between border-b py-4">
        <div class="flex items-center gap-4">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="w-16 h-16 object-contain"
          >

          <div>
            <h3 class="font-bold">${product.name}</h3>

            <p class="text-gray-500">
              ₹${product.price} × ${product.quantity}
            </p>
          </div>
        </div>

        <p class="font-bold">₹${itemTotal}</p>
      </div>
    `;
  });

  orderTotal.innerText = total;
}

// Place order
function placeOrder() {
  if (!activeUser) {
    window.location.href = "login.html";
    return;
  }

  const addressField =
    document.getElementById("deliveryAddress");

  const address = addressField
    ? addressField.value.trim()
    : "";

  const paymentField = document.querySelector(
    'input[name="payment"]:checked'
  );

  // Validate address
  if (!address) {
    showCheckoutMessage(
      "Please enter your delivery address.",
      false
    );

    addressField?.focus();
    return;
  }

  // Validate cart
  if (!cart.length) {
    showCheckoutMessage(
      "Your cart is empty. Add products before placing an order.",
      false
    );
    return;
  }

  // Validate payment selection
  if (!paymentField) {
    showCheckoutMessage(
      "Please select a payment method.",
      false
    );
    return;
  }

  // Calculate order total
  const total = cart.reduce((sum, product) => {
    return sum +
      Number(product.price) * Number(product.quantity);
  }, 0);

  // Save delivery address to user profile
  const users = JSON.parse(
    localStorage.getItem("users") || "[]"
  );

  const userIndex = users.findIndex(
    (user) => user.email === activeUser.email
  );

  if (userIndex !== -1) {
    users[userIndex].address = address;

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    activeUser.address = address;

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(activeUser)
    );
  }

  // Create a unique order
  const order = {
    userEmail: activeUser.email,
    orderId: "ORD" + Date.now(),
    products: cart.map((product) => ({ ...product })),
    total: total,
    address: address,
    paymentMethod: paymentField.value,
    orderDate: new Date().toLocaleString(),
    status: "Order placed"
  };

  // Save all orders without deleting previous orders
  const orders = JSON.parse(
    localStorage.getItem("orders") || "[]"
  );

  orders.push(order);

  localStorage.setItem(
    "orders",
    JSON.stringify(orders)
  );

  // Save latest order for backward compatibility
  localStorage.setItem(
    "order",
    JSON.stringify(order)
  );

  // Clear cart after successful order placement
  localStorage.setItem("cart", "[]");
  localStorage.removeItem("grocery_cart");

  window.dispatchEvent(new Event("cart:updated"));

  // Open My Orders in single-order confirmation mode
  window.location.href =
    "my-orders.html?placed=1&orderId=" +
    encodeURIComponent(order.orderId);
}

// Prefill saved delivery address
const addressField =
  document.getElementById("deliveryAddress");

if (addressField && activeUser?.address) {
  addressField.value = activeUser.address;
}

// Display checkout summary
displayOrder();