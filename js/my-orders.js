(() => {
  // Read Local Storage safely
  function readStorage(key, fallback = []) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  // Escape HTML
  function safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  // Format price
  function money(value) {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Check logged-in user
  const user = readStorage("loggedInUser", null);

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Main container
  const container = document.getElementById("myOrders");

  const searchInput = document.getElementById("orderSearch");
  const orderCount = document.getElementById("orderCount");

  if (!container) {
    console.error('Element with id="myOrders" was not found.');
    return;
  }

  // Check page mode
  const pageParams = new URLSearchParams(window.location.search);

  const isJustPlacedView = pageParams.get("placed") === "1";
  const requestedOrderId = pageParams.get("orderId");

  // Show order success message after checkout
  if (isJustPlacedView) {
    document.getElementById("successMessage")
      ?.classList.remove("hidden");
  }

  // Get saved orders
  const savedOrders = readStorage("orders", []);

  const userEmail = String(user.email || "").toLowerCase();

  // Only show orders belonging to the logged-in user
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

    if (order.total != null) {
      groupedOrder.total = order.total;
    }

    if (order.status) {
      groupedOrder.status = order.status;
    }
  });

  // Latest orders first
  const allOrders = [...groupedOrders.values()].reverse();

  // Select the exact order just placed
  const justPlacedOrder = isJustPlacedView
    ? allOrders.find(
        (order) =>
          String(order.orderId) === String(requestedOrderId)
      ) || null
    : null;

  // Checkout page: one order
  // Normal My Orders page: all orders
  const orders = isJustPlacedView
    ? (justPlacedOrder ? [justPlacedOrder] : [])
    : allOrders;

  let showAllOrders = false;

  // Render all products in an order
  function renderProducts(products) {
    if (!products.length) {
      return `
        <p class="py-4 text-sm text-gray-500">
          No product details available.
        </p>
      `;
    }

    return products.map((product) => {
      const name = safe(product.name || "Product");
      const image = safe(product.image || product.img || "");

      const quantity = Math.max(
        1,
        Number(product.quantity) || 1
      );

      const price = Number(product.price) || 0;

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

  // Render one order card
  function renderOrder(order, index) {
    const products = order.products || [];

    const firstProduct = products[0] || {};

    const productName = firstProduct.name || "Order details";

    const productImage =
      firstProduct.image || firstProduct.img || "";

    const totalQuantity = products.reduce((sum, product) => {
      return sum + Math.max(
        1,
        Number(product.quantity) || 1
      );
    }, 0);

    const calculatedTotal = products.reduce((sum, product) => {
      return sum +
        (Number(product.price) || 0) *
        Math.max(1, Number(product.quantity) || 1);
    }, 0);

    const total = order.total != null
      ? Number(order.total)
      : calculatedTotal;

    const autoOpen = isJustPlacedView;

    return `
      <article
        class="order-card mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white"
        data-order-id="${safe(order.orderId)}"
      >

        <button
          type="button"
          class="order-toggle flex w-full items-center gap-3 p-4 text-left hover:bg-gray-50 md:p-5"
          aria-expanded="${autoOpen}"
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
            <h3 class="font-bold text-gray-900">
              ${safe(productName)}
            </h3>

            <p class="mt-1 text-sm text-gray-500">
              ${
                products.length > 1
                  ? `+ ${products.length - 1} more product(s)`
                  : "View product details"
              }
            </p>

            <p class="mt-1 text-xs text-gray-500">
              ${totalQuantity} item(s)
            </p>
          </div>

          <div class="shrink-0 text-right">
            <p class="text-xs text-gray-500">Total</p>

            <p class="font-bold text-green-700">
              ₹${money(total)}
            </p>

            <span class="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
              Details
              <span class="chevron">
                ${autoOpen ? "⌃" : "⌄"}
              </span>
            </span>
          </div>

        </button>

        <section
          id="order-details-${index}"
          class="order-details ${
            autoOpen ? "" : "hidden"
          } border-t border-gray-200"
        >

          <div class="grid gap-3 bg-gray-50 p-4 text-sm sm:grid-cols-2">

            <div>
              <p class="text-gray-500">Order ID</p>
              <p class="mt-1 break-all font-medium">
                ${safe(order.orderId)}
              </p>
            </div>

            <div>
              <p class="text-gray-500">Order Date</p>
              <p class="mt-1 font-medium">
                ${safe(order.orderDate || "Not available")}
              </p>
            </div>

            <div>
              <p class="text-gray-500">Payment Method</p>
              <p class="mt-1 font-medium">
                ${safe(order.paymentMethod || "Not provided")}
              </p>
            </div>

            <div>
              <p class="text-gray-500">Order Status</p>
              <p class="mt-1 font-semibold text-green-700">
                ${safe(order.status || "Order placed")}
              </p>
            </div>

            <div class="sm:col-span-2">
              <p class="text-gray-500">Delivery Address</p>
              <p class="mt-1 whitespace-pre-line font-medium">
                ${safe(order.address || "Not provided")}
              </p>
            </div>

          </div>

          <div class="p-4 md:p-5">

            <h4 class="font-bold text-gray-900">
              Products Ordered (${products.length})
            </h4>

            <div class="mt-2">
              ${renderProducts(products)}
            </div>

            <div class="mt-4 space-y-2 border-t pt-4 text-sm">

              <div class="flex justify-between gap-3">
                <span class="text-gray-500">Total Items</span>
                <span>${totalQuantity}</span>
              </div>

              <div class="flex justify-between gap-3 text-base">
                <span class="font-bold">Order Total</span>

                <span class="font-bold text-green-700">
                  ₹${money(total)}
                </span>
              </div>

            </div>

            <div class="no-print mt-5 flex flex-wrap justify-end gap-3">

              <button
                type="button"
                class="invoice-button rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-700 hover:bg-green-50"
                data-order-id="${safe(order.orderId)}"
              >
                🖨 Print Invoice
              </button>

            </div>

          </div>
        </section>

      </article>
    `;
  }

  // Display order history
  function displayOrders(query = "") {
    const filteredOrders = orders.filter((order) => {
      const productNames = (order.products || [])
        .map((product) => product.name || "")
        .join(" ");

      const searchText =
        `${order.orderId} ${productNames}`.toLowerCase();

      return searchText.includes(query.trim().toLowerCase());
    });

    if (orderCount) {
      orderCount.textContent =
        `${filteredOrders.length} order(s)`;
    }

    // Empty state
    if (!filteredOrders.length) {
      container.innerHTML = `
        <div class="rounded-xl border bg-white p-8 text-center">

          <div class="mb-3 text-4xl">🛍️</div>

          <h3 class="text-xl font-bold">
            ${
              isJustPlacedView
                ? "Order not found"
                : orders.length
                  ? "No orders found"
                  : "No orders yet"
            }
          </h3>

          <p class="mt-2 text-sm text-gray-500">
            ${
              isJustPlacedView
                ? "This order could not be found."
                : orders.length
                  ? "Try searching with another product name or order ID."
                  : "Your orders will appear here after you place an order."
            }
          </p>

          <a
            href="${
              isJustPlacedView
                ? "my-orders.html"
                : "index.html"
            }"
            class="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
          >
            ${
              isJustPlacedView
                ? "View My Orders"
                : "Continue Shopping"
            }
          </a>

        </div>
      `;

      updateHistoryButton(0);
      return;
    }

    // Checkout shows one order; normal page shows history
    const visibleOrders =
      isJustPlacedView || showAllOrders
        ? filteredOrders
        : filteredOrders.slice(0, 4);

    container.innerHTML = visibleOrders
      .map((order, index) => renderOrder(order, index))
      .join("");

    // Add More Order History button below the current order
    if (isJustPlacedView) {
      container.innerHTML += `
        <div class="mt-6 mb-6 text-center">

          <button
            id="moreOrderHistoryButton"
            type="button"
            class="rounded-xl bg-green-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
          >
            More Order History →
          </button>

        </div>
      `;
    }

    updateHistoryButton(filteredOrders.length);
  }

  // Show / hide normal order history button
  function updateHistoryButton(totalOrders) {
    let historyButton =
      document.getElementById("orderHistoryButton");

    if (!historyButton) {
      historyButton = document.createElement("button");

      historyButton.id = "orderHistoryButton";
      historyButton.type = "button";

      historyButton.className =
        "mt-2 w-full rounded-xl border border-green-600 bg-white px-5 py-3 font-semibold text-green-700 hover:bg-green-50";

      container.insertAdjacentElement(
        "afterend",
        historyButton
      );
    }

    if (isJustPlacedView || totalOrders <= 4) {
      historyButton.classList.add("hidden");
      return;
    }

    historyButton.classList.remove("hidden");

    historyButton.textContent = showAllOrders
      ? "Show Less ▲"
      : `Order History (${totalOrders - 4} more orders) ▼`;
  }

  // Print selected order invoice
  function printInvoice(button) {
    const card = button.closest(".order-card");

    if (!card) return;

    document.querySelectorAll(".print-selected")
      .forEach((element) => {
        element.classList.remove("print-selected");
      });

    const details = card.querySelector(".order-details");

    const wasHidden = details?.classList.contains("hidden");

    card.classList.add("print-selected");
    details?.classList.remove("hidden");

    const cleanup = () => {
      card.classList.remove("print-selected");

      if (details && wasHidden) {
        details.classList.add("hidden");
      }

      window.removeEventListener("afterprint", cleanup);
    };

    window.addEventListener("afterprint", cleanup);

    window.print();

    setTimeout(cleanup, 1500);
  }

  // Handle all order buttons
  container.addEventListener("click", (event) => {

    // More Order History: open normal My Orders page
    if (event.target.closest("#moreOrderHistoryButton")) {
      window.location.href = "my-orders.html";
      return;
    }

    // Expand / collapse order details
    const toggle = event.target.closest(".order-toggle");

    if (toggle) {
      const details = document.getElementById(
        toggle.getAttribute("aria-controls")
      );

      if (!details) return;

      const opening = details.classList.contains("hidden");

      details.classList.toggle("hidden", !opening);

      toggle.setAttribute(
        "aria-expanded",
        String(opening)
      );

      const chevron = toggle.querySelector(".chevron");

      if (chevron) {
        chevron.textContent = opening ? "⌃" : "⌄";
      }

      return;
    }

    // Print invoice
    const invoiceButton =
      event.target.closest(".invoice-button");

    if (invoiceButton) {
      printInvoice(invoiceButton);
    }
  });

  // Normal order history: show more / show less
  document.addEventListener("click", (event) => {
    if (event.target.id !== "orderHistoryButton") return;

    showAllOrders = !showAllOrders;

    displayOrders(searchInput ? searchInput.value : "");
  });

  // Search orders
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      showAllOrders = false;

      displayOrders(searchInput.value);
    });
  }

  // Initial display
  displayOrders();

})();