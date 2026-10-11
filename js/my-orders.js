(() => {

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const safe = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[ch]);

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

 
  //  Check logged-in user
  

  const user = read("loggedInUser", null);

  if (!user) {
    location.href = "login.html";
    return;
  }

  const container = document.getElementById("myOrders");
  const searchInput = document.getElementById("orderSearch");
  const orderCount = document.getElementById("orderCount");

  if (!container) return;

  // Show success message after checkout
  if (new URLSearchParams(location.search).get("placed") === "1") {
    document.getElementById("successMessage")
      ?.classList.remove("hidden");
  }

  
  //  Get current user's orders
  

  const savedOrders = read("orders", []);

  const userEmail = String(user.email || "").toLowerCase();

  const userOrders = savedOrders.filter((order) => {
    return String(order.userEmail || "").toLowerCase() === userEmail;
  });

  // Group products by order ID
  const groupedOrders = new Map();

  userOrders.forEach((order, index) => {
    const orderId = String(
      order.orderId || `ORDER-${index + 1}`
    );

    if (!groupedOrders.has(orderId)) {
      groupedOrders.set(orderId, {
        ...order,
        orderId,
        products: []
      });
    }

    const groupedOrder = groupedOrders.get(orderId);

    if (Array.isArray(order.products)) {
      groupedOrder.products.push(...order.products);
    } else if (order.name) {
      groupedOrder.products.push(order);
    }

    if (order.address) {
      groupedOrder.address = order.address;
    }

    if (order.paymentMethod) {
      groupedOrder.paymentMethod = order.paymentMethod;
    }

    if (order.orderDate) {
      groupedOrder.orderDate = order.orderDate;
    }
  });

  // Latest orders first
  const orders = [...groupedOrders.values()].reverse();

  // Show only 4 orders initially
  let showAllOrders = false;

 
  //  Render product list
  

  function renderProducts(products) {
    if (!products.length) {
      return `
        <p class="py-4 text-sm text-gray-500">
          No product details available.
        </p>
      `;
    }

    return products.map((item) => {
      const name = safe(item.name || "Product");
      const image = safe(item.image || item.img || "");
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const price = Number(item.price) || 0;

      return `
        <div class="flex items-center gap-4 border-b py-4 last:border-b-0">

          <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2">
            ${
              image
                ? `
                  <img
                    src="${image}"
                    alt="${name}"
                    class="h-full w-full object-contain"
                    onerror="this.style.display='none'"
                  >
                `
                : `<span class="text-3xl">🛒</span>`
            }
          </div>

          <div class="min-w-0 flex-1">
            <h4 class="font-semibold text-gray-900">
              ${name}
            </h4>

            <p class="mt-1 text-sm text-gray-500">
              Quantity: ${quantity}
            </p>

            <p class="mt-1 text-sm text-gray-500">
              Price: ₹${money(price)}
            </p>
          </div>

          <p class="whitespace-nowrap font-bold">
            ₹${money(price * quantity)}
          </p>

        </div>
      `;
    }).join("");
  }

  
  //  Render one order card
  

  function renderOrder(order, index) {
    const products = order.products || [];
    const firstProduct = products[0] || {};

    const productName = firstProduct.name || "Order details";
    const productImage = firstProduct.image || firstProduct.img || "";

    const totalQuantity = products.reduce((sum, item) => {
      return sum + Math.max(1, Number(item.quantity) || 1);
    }, 0);

    // Calculate total from products if order.total is missing
    const calculatedTotal = products.reduce((sum, item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return sum + (Number(item.price) || 0) * quantity;
    }, 0);

    const orderTotal = order.total != null
      ? Number(order.total)
      : calculatedTotal;

    const productCountText = products.length > 1
      ? `+ ${products.length - 1} more product(s)`
      : "View product details";

    return `
      <article
        class="order-card mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white"
        data-order-id="${safe(order.orderId)}"
      >

        <!-- Order summary -->
        <button
          type="button"
          class="order-toggle flex w-full items-center gap-3 p-4 text-left hover:bg-gray-50 md:p-5"
          aria-expanded="false"
          aria-controls="order-details-${index}"
        >

          <div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2">
            ${
              productImage
                ? `
                  <img
                    src="${safe(productImage)}"
                    alt="${safe(productName)}"
                    class="h-full w-full object-contain"
                    onerror="this.style.display='none'"
                  >
                `
                : `<span class="text-3xl">🛒</span>`
            }
          </div>

          <div class="min-w-0 flex-1">

            <!-- Product name instead of Order ID -->
            <h3 class="font-bold text-gray-900">
              ${safe(productName)}
            </h3>

            <p class="mt-1 text-sm text-gray-500">
              ${safe(productCountText)}
            </p>

            <p class="mt-1 text-xs text-gray-500">
              ${totalQuantity} item(s)
            </p>

          </div>

          <div class="shrink-0 text-right">
            <p class="text-xs text-gray-500">Total</p>

            <p class="font-bold text-green-700">
              ₹${money(orderTotal)}
            </p>

            <span class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
              Details <span class="chevron">⌄</span>
            </span>
          </div>

        </button>

        <!-- Order details dropdown -->
        <section
          id="order-details-${index}"
          class="order-details hidden border-t border-gray-200"
        >

          <div class="grid gap-3 bg-gray-50 p-4 text-sm sm:grid-cols-2">

            <div>
              <p class="text-gray-500">Order ID</p>
              <p class="mt-1 break-all font-medium">
                ${safe(order.orderId)}
              </p>
            </div>

            <div>
              <p class="text-gray-500">Order date</p>
              <p class="mt-1 font-medium">
                ${safe(order.orderDate || "Not available")}
              </p>
            </div>

            <div>
              <p class="text-gray-500">Payment method</p>
              <p class="mt-1 font-medium">
                ${safe(order.paymentMethod || "Not provided")}
              </p>
            </div>

            <div>
              <p class="text-gray-500">Order status</p>
              <p class="mt-1 font-semibold text-green-700">
                Order placed
              </p>
            </div>

            <div class="sm:col-span-2">
              <p class="text-gray-500">Delivery address</p>
              <p class="mt-1 whitespace-pre-line font-medium">
                ${safe(order.address || "Not provided")}
              </p>
            </div>

          </div>

          <div class="p-4 md:p-5">

            <h4 class="font-bold text-gray-900">
              Products ordered (${products.length})
            </h4>

            <div class="mt-2">
              ${renderProducts(products)}
            </div>

            <div class="mt-4 space-y-2 border-t pt-4 text-sm">

              <div class="flex justify-between gap-3">
                <span class="text-gray-500">Total items</span>
                <span>${totalQuantity}</span>
              </div>

              <div class="flex justify-between gap-3 text-base">
                <span class="font-bold">Order total</span>
                <span class="font-bold text-green-700">
                  ₹${money(orderTotal)}
                </span>
              </div>

            </div>

            <div class="no-print mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                class="invoice-button rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-700 hover:bg-green-50"
                data-order-id="${safe(order.orderId)}"
              >
                🖨 Download Invoice
              </button>
            </div>

          </div>
        </section>

      </article>
    `;
  }


  //  Order History button
  

  function updateHistoryButton(totalOrders) {
    let historyButton = document.getElementById("orderHistoryButton");

    if (!historyButton) {
      historyButton = document.createElement("button");
      historyButton.id = "orderHistoryButton";
      historyButton.type = "button";

      historyButton.className =
        "mt-2 w-full rounded-xl border border-green-600 bg-white px-5 py-3 font-semibold text-green-700 hover:bg-green-50";

      container.insertAdjacentElement("afterend", historyButton);
    }

    if (totalOrders <= 4) {
      historyButton.classList.add("hidden");
      return;
    }

    historyButton.classList.remove("hidden");

    historyButton.textContent = showAllOrders
      ? "Show Less ▲"
      : `Order History (${totalOrders - 4} more orders) ▼`;
  }

  
  // Display orders
  

  function displayOrders(query = "") {
    const filteredOrders = orders.filter((order) => {
      const productNames = (order.products || [])
        .map((item) => item.name || "")
        .join(" ");

      const searchText =
        `${order.orderId} ${productNames}`.toLowerCase();

      return searchText.includes(query.trim().toLowerCase());
    });

    if (orderCount) {
      orderCount.textContent = `${filteredOrders.length} order(s)`;
    }

    if (!filteredOrders.length) {
      container.innerHTML = `
        <div class="rounded-xl border bg-white p-8 text-center">
          <div class="mb-3 text-4xl">🛍️</div>

          <h3 class="text-xl font-bold">
            ${orders.length ? "No orders found" : "No orders yet"}
          </h3>

          <p class="mt-2 text-sm text-gray-500">
            ${
              orders.length
                ? "Try searching another product name or order ID."
                : "Your placed orders will appear here."
            }
          </p>

          ${
            !orders.length
              ? `
                <a
                  href="index.html"
                  class="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
                >
                  Start shopping
                </a>
              `
              : ""
          }
        </div>
      `;

      updateHistoryButton(0);
      return;
    }

    // Show first 4 orders, or all if history is expanded
    const visibleOrders = showAllOrders
      ? filteredOrders
      : filteredOrders.slice(0, 4);

    container.innerHTML = visibleOrders
      .map((order, index) => renderOrder(order, index))
      .join("");

    updateHistoryButton(filteredOrders.length);
  }

 
  //  Order dropdown + invoice
  

  container.addEventListener("click", (event) => {
    const toggle = event.target.closest(".order-toggle");

    if (toggle) {
      const details = document.getElementById(
        toggle.getAttribute("aria-controls")
      );

      if (!details) return;

      const isOpening = details.classList.contains("hidden");

      details.classList.toggle("hidden", !isOpening);
      toggle.setAttribute("aria-expanded", String(isOpening));

      const chevron = toggle.querySelector(".chevron");

      if (chevron) {
        chevron.textContent = isOpening ? "⌃" : "⌄";
      }

      return;
    }

    const invoiceButton = event.target.closest(".invoice-button");

    if (invoiceButton) {
      const orderId = invoiceButton.dataset.orderId;

      const order = orders.find(
        (item) => String(item.orderId) === String(orderId)
      );

      if (order) {
        printInvoice(order, invoiceButton);
      }
    }
  });

  
  //  Print selected order invoice
 

  function printInvoice(order, button) {
    const card = button.closest(".order-card");

    if (!card) return;

    document.querySelectorAll(".print-selected")
      .forEach((element) => {
        element.classList.remove("print-selected");
      });

    const details = card.querySelector(".order-details");
    const wasHidden = details?.classList.contains("hidden");

    card.classList.add("print-selected");

    if (details) {
      details.classList.remove("hidden");
    }

    const cleanup = () => {
      card.classList.remove("print-selected");

      if (details && wasHidden) {
        details.classList.add("hidden");
      }

      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);

    window.print();

    // Fallback for browsers that delay afterprint
    setTimeout(cleanup, 1500);
  }

  
  //  History button click
  

  document.addEventListener("click", (event) => {
    if (event.target.id !== "orderHistoryButton") return;

    showAllOrders = !showAllOrders;

    displayOrders(searchInput ? searchInput.value : "");
  });

  
  //  Search orders
 

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      // Searching should still respect the 4-order limit
      showAllOrders = false;
      displayOrders(searchInput.value);
    });
  }

  // Initial display
  displayOrders();
})();