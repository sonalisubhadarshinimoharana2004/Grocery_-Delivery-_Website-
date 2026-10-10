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
    window.location.href = "login.html";
    return;
  }
  const safe = (value) =>
    String(value ?? "").replace(
      /[&<>\"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '\"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const container = document.getElementById("myOrders");
  if (new URLSearchParams(window.location.search).get("placed") === "1")
    document.getElementById("successMessage").classList.remove("hidden");
  const orders = read("orders", [])
    .filter(
      (o) =>
        (o.userEmail || "").toLowerCase() === (user.email || "").toLowerCase(),
    )
    .slice()
    .reverse();
  if (!orders.length) {
    container.innerHTML =
      '<div class="rounded-2xl bg-white p-10 text-center shadow-sm"><p class="text-5xl mb-3">🛍️</p><h2 class="text-xl font-bold">No orders yet</h2><p class="text-gray-500 mt-2">Your placed orders will appear here.</p><a href="index.html" class="inline-block mt-5 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700">Start shopping</a></div>';
    return;
  }
  container.innerHTML = orders
    .map((order) => {
      const products = Array.isArray(order.products) ? order.products : [];
      return `<article class="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6">
      <div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-wide text-gray-500">Order ID</p><h2 class="font-bold text-lg">${safe(order.orderId || "Order")}</h2><p class="text-sm text-gray-500 mt-1">${safe(order.orderDate || "")}</p></div><div class="text-right"><p class="text-xs text-gray-500">Order total</p><p class="text-xl font-bold text-green-700">₹${Number(order.total || 0).toFixed(2)}</p><span class="inline-block mt-2 rounded-full bg-green-50 text-green-700 text-xs font-semibold px-3 py-1">Order placed</span></div></div>
      <div class="mt-5 border-t pt-4"><h3 class="font-semibold mb-3">Items ordered (${products.length})</h3><div class="space-y-3">${products.map((item) => `<div class="flex items-center justify-between gap-3 text-sm"><div class="min-w-0"><p class="font-medium">${safe(item.name)}</p><p class="text-gray-500">Qty: ${Number(item.quantity || 1)} × ₹${Number(item.price || 0).toFixed(2)}</p></div><p class="font-semibold whitespace-nowrap">₹${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</p></div>`).join("")}</div></div>
      <div class="mt-5 border-t pt-4 grid sm:grid-cols-2 gap-4 text-sm"><div><p class="text-gray-500">Delivery address</p><p class="font-medium mt-1 whitespace-pre-line">${safe(order.address || "Not provided")}</p></div><div><p class="text-gray-500">Payment method</p><p class="font-medium mt-1">${safe(order.paymentMethod || "Not provided")}</p></div></div>
    </article>`;
    })
    .join("");
})();