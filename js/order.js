// Get cart from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const orderSummary = document.getElementById("orderSummary");
const orderTotal = document.getElementById("orderTotal");


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

        alert("Please enter your delivery address.");

        return;
    }


    // Cart validation
    if (cart.length === 0) {

        alert("Your cart is empty.");

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


    // Create Order Object
    const order = {

        orderId: "ORD" + Date.now(),

        products: cart,

        total: total,

        address: address,

        paymentMethod: payment,

        orderDate: new Date().toLocaleString()

    };


    // Save Order in Local Storage
    localStorage.setItem(
        "order",
        JSON.stringify(order)
    );


    // Clear Cart
    localStorage.removeItem("cart");


    // Success
    alert(
        "Order placed successfully! 🎉\n\n" +
        "Order ID: " + order.orderId +
        "\nTotal: ₹" + total
    );


    // Go to home page
    window.location.href = "index.html";
}


// Display order when page opens
displayOrder();