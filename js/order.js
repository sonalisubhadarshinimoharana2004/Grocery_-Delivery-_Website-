// Require a signed-in customer before checkout
const activeUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
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
    box.className = `rounded-xl p-3 mb-5 text-sm ${success ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`;
}

// Display Cart Products + Total
function displayOrder() {

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

    cart.forEach(product => {

        let itemTotal =
            Number(product.price) * Number(product.quantity);

        total += itemTotal;

        orderSummary.innerHTML += `

            <div class="flex items-center justify-between
                        border-b py-4">

                <div class="flex items-center gap-4">

                    <img
                        src="${product.image}"
                        class="w-16 h-16 object-contain"
                    >

                    <div>

                        <h3 class="font-bold">
                            ${product.name}
                        </h3>

                        <p class="text-gray-500">
                            ₹${product.price} × ${product.quantity}
                        </p>

                    </div>

                </div>

                <p class="font-bold">
                    ₹${itemTotal}
                </p>

            </div>

        `;
    });


    // Show total in order.html
    orderTotal.innerText = total;
}


// Place Order
function placeOrder() {

    const address =
        document.getElementById("deliveryAddress").value.trim();

    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    // Address validation
    if (address === "") {
        showCheckoutMessage("Please enter your delivery address.", false);
        document.getElementById("deliveryAddress").focus();
        return;
    }


    // Cart validation
    if (cart.length === 0) {
        showCheckoutMessage("Your cart is empty. Add products before placing an order.", false);
        return;
    }


    // Calculate total
    let total = cart.reduce(
        (sum, product) => {

            return sum +
                Number(product.price) *
                Number(product.quantity);

        },
        0
    );


    // Save the delivery address to this user's profile
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.email === activeUser.email);
    if (userIndex !== -1) {
        users[userIndex].address = address;
        localStorage.setItem("users", JSON.stringify(users));
        activeUser.address = address;
        localStorage.setItem("loggedInUser", JSON.stringify(activeUser));
    }

    // Create Order Object
    const order = {
        userEmail: activeUser.email,
        orderId: "ORD" + Date.now(),

        products: cart,

        total: total,

        address: address,

        paymentMethod: payment,

        orderDate: new Date().toLocaleString()

    };


    // Keep every order and associate it with the logged-in customer
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    // Keep the latest order under the old key too, for compatibility
    localStorage.setItem("order", JSON.stringify(order));


    // Clear Cart
    localStorage.removeItem("cart");


    // Continue without a blocking popup; show confirmation on the My Orders page.
    window.location.href = "my-orders.html?placed=1";
}


// Prefill saved delivery address for the signed-in user
const addressField = document.getElementById("deliveryAddress");
if (addressField && activeUser && activeUser.address) addressField.value = activeUser.address;

// Display order when page opens
displayOrder();