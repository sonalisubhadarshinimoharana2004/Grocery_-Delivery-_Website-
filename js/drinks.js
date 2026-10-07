const products = [

    {
        id: 1,
        name: "Diet Coke",
        quantity: "330 ml",
        price: 50,
        oldPrice: 55,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500"
    },

    {
        id: 2,
        name: "Sprite Lime Flavored Soft Drink",
        quantity: "750 ml",
        price: 39,
        oldPrice: 40,
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500"
    },

    {
        id: 3,
        name: "Thums Up Cola Soft Drink",
        quantity: "2.25 L",
        price: 87,
        oldPrice: 90,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500"
    },

    {
        id: 4,
        name: "Thums Up Soft Drink",
        quantity: "300 ml",
        price: 40,
        oldPrice: 45,
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"
    },

    {
        id: 5,
        name: "Coca-Cola Soft Drink",
        quantity: "750 ml",
        price: 38,
        oldPrice: 40,
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"
    },

    {
        id: 6,
        name: "Coca-Cola Soft Drink",
        quantity: "300 ml",
        price: 40,
        oldPrice: 45,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500"
    },

    {
        id: 7,
        name: "Fizzy Cola",
        quantity: "500 ml",
        price: 35,
        oldPrice: 40,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500"
    },

    {
        id: 8,
        name: "Coca-Cola Zero Sugar",
        quantity: "300 ml",
        price: 45,
        oldPrice: 50,
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500"
    },

    {
        id: 9,
        name: "Sprite",
        quantity: "750 ml",
        price: 39,
        oldPrice: 45,
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500"
    },

    {
        id: 10,
        name: "Pepsi Zero Sugar",
        quantity: "250 ml",
        price: 40,
        oldPrice: 45,
        image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500"
    }

];


const productContainer =
    document.getElementById("productContainer");


function displayProducts(productList) {

    productContainer.innerHTML = "";


    productList.forEach(product => {

        productContainer.innerHTML += `

            <div class="bg-white rounded-xl p-3 shadow-sm
                        hover:shadow-lg transition">

                <img
                    src="${product.image}"
                    class="w-full h-48 object-contain rounded-lg"
                >


                <p class="text-xs text-gray-500 mt-2">
                    🕐 11 MINS
                </p>


                <h2 class="font-semibold mt-2 h-12">
                    ${product.name}
                </h2>


                <p class="text-gray-500 text-sm">
                    ${product.quantity}
                </p>


                <div class="flex items-center justify-between mt-4">

                    <div>

                        <span class="font-bold">
                            ₹${product.price}
                        </span>

                        <span class="text-gray-400 line-through text-sm ml-1">
                            ₹${product.oldPrice}
                        </span>

                    </div>


                    <button
                        onclick="addToCart(${product.id})"
                        class="border border-green-600 text-green-600
                               font-semibold px-4 py-2 rounded-lg
                               hover:bg-green-600 hover:text-white">

                        ADD

                    </button>

                </div>

            </div>

        `;

    });

}


displayProducts(products);



/* Add product to localStorage */

function addToCart(productId) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const product =
        products.find(item => item.id === productId);


    const existingProduct =
        cart.find(item => item.id === productId);


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();

    alert(`${product.name} added to cart!`);

}



/* Cart count */

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    const totalItems =
        cart.reduce(
            (total, item) => total + item.quantity,
            0
        );


    document.getElementById("cartCount").innerText =
        totalItems;

}


updateCartCount();



/* Search */

document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const searchValue =
            this.value.toLowerCase();


        const filteredProducts =
            products.filter(product =>
                product.name
                    .toLowerCase()
                    .includes(searchValue)
            );


        displayProducts(filteredProducts);

    });