const categories = [

    // 1
    {
        id: 1,
        name: "Fruits",
        image: "./Assets/fruits.jpg",
        link: "#"
    },

    // 2
    {
        id: 2,
        name: "Vegetables",
        image: "./Assets/vegitable.png",
        link: "#"
    },

    // 3
    {
        id: 3,
        name: "Dairy",
        image: "./Assets/Dairyproduct.png",
        link: "#"
    },

    // 4
    {
        id: 4,
        name: "Bakery",
        image: "./Assets/bakery.png",
        link: "#"
    },

    // 5
    {
        id: 5,
        name: "Snacks",
        image: "./Assets/snaks.png",
        link: "#"
    },

    // 6
    {
        id: 6,
        name: "Atta, Rice & Dal",
        image: "./Assets/atta_rice_dal.webp",
        link: "#"
    },

    // 7
    {
        id: 7,
        name: "Oil, Ghee & Masala",
        image: "./Assets/oilghee.png",
        link: "#"
    },

    // 8
    {
        id: 8,
        name: "Beverages",
        image: "./Assets/coldrinksand juice.webp",
        link: "./drinks.html"
    },

    // 9
    {
        id: 9,
        name: "Tea, Coffee & Milk Drinks",
        image: "./Assets/tea_cofee.jpg",
        link: "#"
    },

    // 10
    {
        id: 10,
        name: "Pet Care",
        image: "./Assets/petcare.avif",
        link: "#"
    },

    // 11
    {
        id: 11,
        name: "Personal Care",
        image: "./Assets/personalcare.png",
        link: "#"
    },

    // 12
    {
        id: 12,
        name: "Home & Office",
        image: "./Assets/office.png",
        link: "#"
    },

    // 13
    {
        id: 13,
        name: "Pharma & Wellness",
        image: "./Assets/pharma.png",
        link: "#"
    },

    // 14
    {
        id: 14,
        name: "Baby Care",
        image: "./Assets/babycare.webp",
        link: "#"
    },

    // 15
    {
        id: 15,
        name: "Chicken, Meat & Fish",
        image: "./Assets/chicken.png",
        link: "#"
    },

    // 16
    {
        id: 16,
        name: "Sauces & Spreads",
        image: "./Assets/sauces.png",
        link: "#"
    }

];


const categoryContainer =
    document.getElementById("categoryContainer");


function displayCategories() {

    categoryContainer.innerHTML = "";

    categories.forEach(category => {

        categoryContainer.innerHTML += `

            <a
                href="${category.link}"
                class="bg-white rounded-2xl p-4 text-center
                       hover:shadow-md transition cursor-pointer block">

                <img
                    src="${category.image}"
                    alt="${category.name}"
                    class="h-20 w-full object-contain">

                <p class="mt-3 text-sm font-semibold">
                    ${category.name}
                </p>

            </a>

        `;

    });

}


displayCategories();