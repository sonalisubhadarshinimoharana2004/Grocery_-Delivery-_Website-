(() => {
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const user = read("loggedInUser", null);
  if (!user) {
    location.href = "login.html";
    return;
  }
  const safe = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const container = document.getElementById("myOrders");
  if (new URLSearchParams(location.search).get("placed") === "1")
    document.getElementById("successMessage")?.classList.remove("hidden");
  const orders = read("orders", [])
    .filter(
      (o) =>
        (o.userEmail || "").toLowerCase() === (user.email || "").toLowerCase(),
    )
    .slice()
    .reverse();
  const historyPanel = document.getElementById("orderHistoryPanel");
  const historyButton = document.getElementById("orderHistoryButton");
  const renderOrder = (order) => {
    const products = Array.isArray(order.products) ? order.products : [];
    return `<article class="order-print-target bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6 mb-4"><div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-wide text-gray-500">Order ID</p><h2 class="font-bold text-lg">${safe(order.orderId || "Order")}</h2><p class="text-sm text-gray-500 mt-1">${safe(order.orderDate || "")}</p></div><div class="text-right"><p class="text-xs text-gray-500">Order total</p><p class="text-xl font-bold text-green-700">₹${Number(order.total || 0).toFixed(2)}</p><span class="inline-block mt-2 rounded-full bg-green-50 text-green-700 text-xs font-semibold px-3 py-1">Order placed</span></div></div><div class="mt-5 border-t pt-4"><h3 class="font-semibold mb-3">Items ordered (${products.length})</h3><div class="space-y-3">${products.map((item) => `<div class="flex items-center justify-between gap-3 text-sm"><div class="min-w-0"><p class="font-medium">${safe(item.name)}</p><p class="text-gray-500">Qty: ${Number(item.quantity || 1)} × ₹${Number(item.price || 0).toFixed(2)}</p></div><p class="font-semibold whitespace-nowrap">₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p></div>`).join("")}</div></div><div class="mt-5 border-t pt-4 grid sm:grid-cols-2 gap-4 text-sm"><div><p class="text-gray-500">Delivery address</p><p class="font-medium mt-1 whitespace-pre-line">${safe(order.address || "Not provided")}</p></div><div><p class="text-gray-500">Payment method</p><p class="font-medium mt-1">${safe(order.paymentMethod || "Not provided")}</p></div></div><div class="mt-5 flex justify-end print:hidden"><button type="button" class="print-order rounded-lg bg-green-600 px-4 py-2 text-white font-semibold hover:bg-green-700">🖨 Print order</button></div></article>`;
  };
  const printOrder = (button) => {
    const card = button.closest(".order-print-target");
    if (!card) return;
    document
      .querySelectorAll(".order-print-target")
      .forEach((el) => el.classList.remove("print-selected"));
    card.classList.add("print-selected");
    window.print();
    setTimeout(() => card.classList.remove("print-selected"), 500);
  };
  if (!orders.length) {
    container.innerHTML =
      '<div class="rounded-2xl bg-white p-10 text-center shadow-sm"><p class="text-5xl mb-3">🛍️</p><h2 class="text-xl font-bold">No orders yet</h2><p class="text-gray-500 mt-2">Your placed orders will appear here.</p><a href="index.html" class="inline-block mt-5 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700">Start shopping</a></div>';
    if (historyButton) historyButton.classList.add("hidden");
    return;
  }
  container.innerHTML = renderOrder(orders[0]);
  container.addEventListener("click", (event) => {
    const btn = event.target.closest(".print-order");
    if (btn) printOrder(btn);
  });
  if (historyPanel && historyButton) {
    historyPanel.innerHTML =
      orders.length > 1
        ? orders.slice(1).map(renderOrder).join("")
        : '<div class="rounded-xl bg-white p-5 text-gray-500">No older orders. Your recent order is shown above.</div>';
    historyButton.addEventListener("click", () => {
      const opening = historyPanel.classList.contains("hidden");
      historyPanel.classList.toggle("hidden", !opening);
      historyButton.textContent = opening
        ? "Hide order history"
        : "Order history";
      if (opening)
        historyPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    historyPanel.addEventListener("click", (event) => {
      const btn = event.target.closest(".print-order");
      if (btn) printOrder(btn);
    });
  }
})();
