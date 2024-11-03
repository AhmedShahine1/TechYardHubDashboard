import { CategoriesAPI, ProductsAPI } from "./api.js";

$(document).ready(function () {
    let allProducts = {
        laptops: [],
        desktops: [],
        accessories: []
    };
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebarCategoryList = document.getElementById('sidebar-category-list');
    // Fetch categories and populate both nav and sidebar
    async function fetchCategories() {
        try {
            const categories = await CategoriesAPI.getAllCategories();
            const categoryList = document.getElementById('category-list');
            categoryList.innerHTML = ''; // Clear existing categories
            renderCategories(categories, '#categories-container');
            categories.forEach(category => {
                const listItem = `<li><a href="Shop.html?Category=${category.name}">${category.name}</a></li>`;
                categoryList.insertAdjacentHTML('beforeend', listItem);
                sidebarCategoryList.insertAdjacentHTML('beforeend', listItem);
            });
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Toggle sidebar visibility
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
    });

    // Close sidebar when close button is clicked
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('show');
    });

    function renderCategories(categories, containerId) {
        $(containerId).html('');  // Clear the container

        const categoryHtml = categories.map(category => `
            <div class="product" data-category="${category.name}">
                <img src="${category.imageUrl}" alt="${category.name}" id="Outlines" class="category-image">
                <span>${category.name}</span>
            </div>
        `).join('');

        $(containerId).append(categoryHtml);
        $(`${containerId} .product`).on('click', function() {
            const category = $(this).data('category');
            window.location.href = `Shop.html?Category=${category}`;
        });
    }

    // Call fetchCategories to load categories initially
    fetchCategories();
    async function fetchAllProducts() {
        try {
            const laptops = await ProductsAPI.getLaptops();
            const desktops = await ProductsAPI.getDesktops();
            const accessories = await ProductsAPI.getAccessories();

            allProducts.laptops = laptops;
            allProducts.desktops = desktops;
            allProducts.accessories = accessories;

            // Initially load laptops
            renderProducts(allProducts.laptops, '#laptops-container');
        } catch (error) {
            console.error("Error fetching all products:", error);
        }
    }

    function renderProducts(products, containerId) {
        $(containerId).html('');  // Clear the specific container

        const box = products.map(product => `
            <div class="col-md-4 text-dark text-center p-2">
                <img class="w-100 h-50" src="${product.imageUrl}" alt="Product Image">
                <h3>${product.name}</h3> 
                <p class="text-dark">${product.model}</p> 
                <span>${product.oldPrice} EGP</span> 
            </div>
        `).join('');

        $(containerId).append(box);
    }

    // Initial fetch of all products
    fetchAllProducts();

    const $backgrounds = $('.background');
    const $slider = $('.slider-images');
    const $images = $slider.children();
    let imageIndex = 0;

    function updateSlider() {
        $images.removeClass('active previous next inactive');

        $images.eq(imageIndex).addClass('active');

        $images.eq((imageIndex - 1 + $images.length) % $images.length).addClass('previous');
        $images.eq((imageIndex + 1) % $images.length).addClass('next');

        $images.not('.active, .previous, .next').addClass('inactive');

        $backgrounds.css('opacity', 0);
        $backgrounds.eq(imageIndex).css('opacity', 1);

        imageIndex = (imageIndex + 1) % $images.length;
    }

    updateSlider();
    setInterval(updateSlider, 3000);

    $images.eq(1).addClass('next');
    $images.eq(2).addClass('inactive');
    $images.eq(3).addClass('inactive');
    $images.eq(4).addClass('previous');
    $images.eq(0).addClass('active');

    function showTab(tabId) {
        $('.tab, .tab-content').removeClass('active');
        $(`.tab[onclick="showTab('${tabId}')"]`).addClass('active');
        $(`#${tabId}`).addClass('active');

        // Determine the container ID based on the selected tab
        const containerId = `#${tabId}-container`;

        // Use tabId to decide which products to show
        if (tabId === "laptops") {
            renderProducts(allProducts.laptops, containerId);
        } else if (tabId === "desktops") {
            renderProducts(allProducts.desktops, containerId);
        } else if (tabId === "accessories") {
            renderProducts(allProducts.accessories, containerId);
        }
    }

    // Attach the showTab function to tab clicks
    $('.tab').click(function () {
        const tabId = $(this).attr('onclick').match(/'(.*?)'/)[1];
        showTab(tabId);
    });
});
