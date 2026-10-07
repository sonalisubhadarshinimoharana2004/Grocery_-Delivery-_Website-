let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


const cartContainer =
    document.getElementById("cartContainer");

const totalContainer =
    document.getElementById("totalContainer");


function displayCart() {

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="bg-white p-10 rounded-xl text-center">

                <h2 class="text-2xl font-bold">
                    Your cart is empty 🛒
                </h2>

                <a
                    href="index.html"
                    class="inline-block mt-5
                           bg-green-600 text-white
                           px-6 py-3 rounded-lg">

                    Continue Shopping

                </a>

            </div>

        `;

        totalContainer.innerHTML = "";

        return;
    }


    cart.forEach(product => {

        cartContainer.innerHTML += `

            <div
                class="bg-white p-4 rounded-xl mb-4
                       flex items-center gap-5">

                <img
                    src="${product.image}"
                    class="w-24 h-24 object-contain"
                >


                <div class="flex-1">

                    <h2 class="font-bold">
                        ${product.name}
                    </h2>

                    <p class="text-gray-500">
                        ${product.quantity}
                    </p>

                    <p class="font-semibold mt-2">
                        ₹${product.price}
                    </p>

                </div>


                <div class="flex items-center gap-3">

                    <button
                        onclick="decrease(${product.id})"
                        class="border px-3 py-1 rounded">

                        −

                    </button>


                    <span>
                        ${product.quantity}
                    </span>


                    <button
                        onclick="increase(${product.id})"
                        class="border px-3 py-1 rounded">

                        +

                    </button>

                </div>


                <button
                    onclick="removeProduct(${product.id})"
                    class="text-red-500">

                    Remove

                </button>

            </div>

        `;

    });


    calculateTotal();

}


function increase(id) {

    const product =
        cart.find(item => item.id === id);

    product.quantity++;

    saveCart();

}


function decrease(id) {

    const product =
        cart.find(item => item.id === id);


    if (product.quantity > 1) {

        product.quantity--;

    } else {

        cart =
            cart.filter(item => item.id !== id);

    }


    saveCart();

}


function removeProduct(id) {

    cart =
        cart.filter(item => item.id !== id);

    saveCart();

}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

}


function calculateTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    totalContainer.innerHTML = `

        <div class="flex justify-between text-xl font-bold">

            <span>
                Total
            </span>

            <span>
                ₹${total}
            </span>

        </div>


        <button
            class="w-full mt-5
                   bg-green-600 text-white
                   py-3 rounded-lg font-bold">

            Proceed to Checkout

        </button>

    `;

}


displayCart();