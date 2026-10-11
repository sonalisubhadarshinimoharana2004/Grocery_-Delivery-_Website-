const categories = [
  // 1
  {
    id: 1,
    name: "Fruits",
    image: "./Assets/fruits.jpg",
    link: "./category.html?category=fruits",
  },

  // 2
  {
    id: 2,
    name: "Vegetables",
    image: "./Assets/vegitable.png",
    link: "./category.html?category=vegetables",
  },

  // 3
  {
    id: 3,
    name: "Dairy",
    image: "./Assets/Dairyproduct.png",
    link: "./category.html?category=dairy",
  },

  // 4
  {
    id: 4,
    name: "Bakery",
    image: "./Assets/bakery.png",
    link: "./category.html?category=bakery",
  },

  // 5
  {
    id: 5,
    name: "Snacks",
    image: "./Assets/snaks.png",
    link: "./category.html?category=snacks",
  },

  // 6
  {
    id: 6,
    name: "Atta, Rice & Dal",
    image: "./Assets/atta_rice_dal.webp",
    link: "./category.html?category=atta-rice-dal",
  },

  // 7
  {
    id: 7,
    name: "Oil, Ghee & Masala",
    image: "./Assets/oilghee.png",
    link: "./category.html?category=oil-ghee-masala",
  },

  // 8
  {
    id: 8,
    name: "Beverages",
    image: "./Assets/coldrinksand juice.webp",
    link: "./category.html?category=drinks",
  },

  // 9
  {
    id: 9,
    name: "Tea, Coffee & Milk Drinks",
    image: "./Assets/tea_cofee.jpg",
    link: "./category.html?category=tea-coffee-milk-drinks",
  },

  // 10
  {
    id: 10,
    name: "Pet Care",
    image: "./Assets/petcare.avif",
    link: "./category.html?category=pet-care",
  },

  // 11
  {
    id: 11,
    name: "Personal Care",
    image: "./Assets/personalcare.png",
    link: "./category.html?category=personal-care",
  },

  // 12
  {
    id: 12,
    name: "Home & Office",
    image: "./Assets/office.png",
    link: "./category.html?category=home-office",
  },

  // 13
  {
    id: 13,
    name: "Pharma & Wellness",
    image: "./Assets/pharma.png",
    link: "./category.html?category=pharma-wellness",
  },

  // 14
  {
    id: 14,
    name: "Baby Care",
    image: "./Assets/babycare.webp",
    link: "./category.html?category=baby-care",
  },

  // 15
  {
    id: 15,
    name: "Chicken, Meat & Fish",
    image: "./Assets/chicken.png",
    link: "./category.html?category=meat-fish",
  },

  // 16
  {
    id: 16,
    name: "Sauces & Spreads",
    image: "./Assets/sauces.png",
    link: "./category.html?category=sauces-spreads",
  },
];

const categoryContainer = document.getElementById("categoryContainer");

function displayCategories() {
  categoryContainer.innerHTML = "";

  categories.forEach((category) => {
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
