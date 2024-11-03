import { CategoriesAPI } from "./api.js";

// Original data
const defaultItemsData = [
    {
        name: 'MacBook Pro 16-inch',
        model: 'M1 Max',
        os: 'macOS Monterey',
        image: `../Images/Macbook Pro 16 with iPhone 11 Pro Max Mockup.jpeg`,
        quantity: 1,
        oldPrice: 2500,
        discount: 10
    },
    {
        name: 'iMac 24-inch',
        model: 'M1',
        os: 'macOS Big Sur',
        image: `../Images/Apple_iMac_24__All-In-One_Computer__Apple_M1__8GB_RAM__256GB_SSD__macOS_Big_Sur__Blue__MJV93LL_A_-_Walmart_com-removebg-preview.png`,
        quantity: 1,
        oldPrice: 1299,
        discount: 10
    },
    {
        name: 'Mac Mini',
        model: 'M1',
        os: 'macOS Big Sur',
        image: `../Images/fixed___hi-res_icons_for_the_new_Mac_mini_2018-removebg-preview.png`,
        quantity: 1,
        oldPrice: 699,
        discount: 10
    }
];

// Function to store data in localStorage
function storeItemsData() {
    localStorage.setItem('itemsData', JSON.stringify(defaultItemsData));
}

// Function to retrieve data from localStorage
function getItemsData() {
    const storedData = localStorage.getItem('itemsData');
    return storedData ? JSON.parse(storedData) : defaultItemsData;
}

let itemsData = [];

// When the page loads
$(document).ready(function () {
    storeItemsData(); // Store data in localStorage
    itemsData = getItemsData(); // Retrieve data
    console.log(itemsData); // Use data as needed

    $('#backToStore1, #backToStore2').on('click', function () {
        window.location.href = 'index.html'; // Change 'index.html' to your main page link
    });

    // Change window size event
    $(window).on('resize', function () {
        const sidebar = $('.sidebar');
        const mainContent = $('#mainContent');
        const backArrow = $('#backArrow');

        if ($(window).width() <= 768) {
            sidebar.addClass('hidden'); // Hide sidebar on mobile
            mainContent.addClass('expanded'); // Expand main content to take 100%
            setTimeout(() => {
                backArrow.addClass('show'); // Show back arrow
            }, 300);
        } else {
            sidebar.removeClass('hidden'); // Show sidebar on larger screens
            mainContent.removeClass('expanded'); // Restore original size of content
            setTimeout(() => {
                backArrow.removeClass('show'); // Hide back arrow
            }, 0);
        }
        renderItems();
    });

    // Execute code on page load
    const toggleSidebarBtn = $('#toggleSidebar');
    const sidebar = $('#sidebar');
    const closeSidebarBtn = $('#closeSidebar');
    const sidebarCategoryList = $('#sidebar-category-list');

    async function fetchCategories() {
        try {
            const categories = await CategoriesAPI.getAllCategories();
            const categoryList = $('#category-list');
            categoryList.empty(); // Clear existing categories
            categories.forEach(category => {
                const listItem = `<li><a href="Shop.html?Category=${category.name}">${category.name}</a></li>`;
                categoryList.append(listItem);
                sidebarCategoryList.append(listItem);
            });
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Toggle sidebar visibility
    toggleSidebarBtn.on('click', () => {
        sidebar.toggleClass('show');
    });

    // Close sidebar when close button is clicked
    closeSidebarBtn.on('click', () => {
        sidebar.removeClass('show');
    });

    fetchCategories();

    if ($(window).width() <= 768) {
        sidebar.addClass('hidden'); // Hide sidebar on mobile
        mainContent.addClass('expanded'); // Expand main content to take 100%
        setTimeout(() => {
            backArrow.addClass('show'); // Show back arrow
        }, 300);
    } else {
        sidebar.removeClass('hidden'); // Show sidebar on larger screens
        mainContent.removeClass('expanded'); // Restore original size of content
        setTimeout(() => {
            backArrow.removeClass('show'); // Hide back arrow
        }, 0);
    }

    renderItems();
});

// When clicking on "x"
$('.fa-xmark').on('click', function () {
    const sidebar = $('.sidebar');
    const mainContent = $('#mainContent');
    const backArrow = $('#backArrow');

    sidebar.addClass('hidden'); // Hide sidebar
    mainContent.addClass('expanded'); // Expand main content to take 100%
    setTimeout(() => {
        backArrow.addClass('show'); // Show back arrow
    }, 300);
});

// When clicking on back arrow
$('#backArrow').on('click', function () {
    const sidebar = $('.sidebar');
    const mainContent = $('#mainContent');
    const backArrow = $('#backArrow');

    sidebar.removeClass('hidden'); // Show sidebar
    mainContent.removeClass('expanded'); // Restore original size of content
    setTimeout(() => {
        backArrow.removeClass('show'); // Hide back arrow
    }, 0);
});

let counter = $('#count');
counter.html(itemsData.length);

// Get table element where rows will be inserted
let subtotalElements = $('.subtotal');
let shippingElements = $('.shipping');
let taxElements = $('.tax');

function getSubTotalValue() {
    let getSubtotal = 0;
    itemsData.forEach(item => {
        getSubtotal += (item.oldPrice * (1 - item.discount / 100)) * item.quantity;
    });
    return getSubtotal;
}

function getPrice(getSubtotal = 0) {
    if (getSubtotal != 0) {
        getSubtotal = getSubTotalValue();
    }

    // Example values
    let subtotalValue = getSubtotal;
    let shippingValue = 0.00; // Shipping cost
    let taxValue = 39.00; // Tax value

    subtotalElements.each(function () {
        $(this).html(subtotalValue.toFixed(2)); // Set subtotal and format to decimal
    });
    shippingElements.each(function () {
        $(this).html(shippingValue.toFixed(2)); // Set shipping and format to decimal
    });
    taxElements.each(function () {
        $(this).html(taxValue.toFixed(2)); // Set tax and format to decimal
    });

    // If you want to check the values
    subtotalElements.each(function () {
        console.log($(this).html());
    });
    shippingElements.each(function () {
        console.log($(this).html());
    });
    taxElements.each(function () {
        console.log($(this).html());
    });

    // Calculate total and sum values
    let totalValue = subtotalValue + shippingValue + taxValue; // Sum values as numbers
    let totalElement = $('.total');
    totalElement.each(function () {
        $(this).html(totalValue.toFixed(2)); // Set total and format to decimal
    });
}

function changeQuantity(index, change) {
    if (itemsData[index].quantity + change > 0) { // Ensure quantity doesn't become negative
        itemsData[index].quantity += change; // Change quantity
        $(`#quantity-${index}`).text(itemsData[index].quantity); // Update display in DOM
        localStorage.setItem('itemsData', JSON.stringify(itemsData)); // Store data as text
    }

    getPrice(getSubTotalValue());
}

// Function to remove item
function removeItem(index) {
    itemsData.splice(index, 1); // Remove item from array
    localStorage.setItem('itemsData', JSON.stringify(itemsData)); // Store data as text

    renderItems(); // Redraw items
}

let cartona = $('#inner-table');

function renderItems() {
    let getSubtotal = 0;
    let content = ''; // Variable to store row content
    itemsData.forEach((item, index) => {
        // Check screen size to determine appropriate layout
        if (window.innerWidth <= 768) { // إذا كانت الشاشة صغيرة
            content += `
            <div class="row my-3 px-3 ">
                <div class="col-4 ">
                    <div class="square-cover">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                </div>
    
                <div class="col-4 d-flex flex-column justify-content-between ">
                    <p class="p-0 m-0 fs-6">${item.name}</p>
                    <p class="p-0 m-0 fs-7"><span class="colr-yellow">${item.os}</span> ${item.model}</p>
                    <div class="pt-2">
                        <div class="d-flex p-0 m-0">
                            <div class="cover-icon d-flex justify-content-center align-items-center">
                                <i class="fa-solid fa-minus" onclick="changeQuantity(${index}, -1)"></i>
                            </div>
                            <p class="p-0 m-0 px-3 fs-6 " id="quantity-${index}">${item.quantity}</p>
                            <div class="cover-icon d-flex justify-content-center align-items-center">
                                <i class="fa-solid fa-plus" onclick="changeQuantity(${index}, 1)"></i>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="col-4  py-1 d-flex flex-column justify-content-between align-items-end ">
                    <i class="fa-solid fa-xmark fs-5" onclick="removeItem(${index})"></i>
                    <div class=" ">
<p>${(item.oldPrice * (1 - item.discount / 100)).toFixed(2)} LE</p>
                    </div>
                </div>
            </div>
            `;
        } else { // إذا كانت الشاشة أكبر
            content += `
            <div class="row my-3  align-items-center">
                <div class="col-2 ">
                    <div class="square-cover ">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                </div>

                <div class="col-2 ">
                    <h5>${item.name}</h5>
                    <p>${item.model}</p>
                </div>

                <div class="col-2 text-center ">
                    <p>${item.os}</p>
                </div>

                <div class="col-2 ">
                    <div class="d-flex justify-content-center">
                        <div class="cover-icon d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-minus" onclick="changeQuantity(${index}, -1)"></i>
                        </div>
                        <p class="px-3" id="quantity-${index}">${item.quantity}</p>
                        <div class="cover-icon d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-plus" onclick="changeQuantity(${index}, 1)"></i>
                        </div>
                    </div>
                </div>

                <div class="col-2 text-center ">
                <p>${(item.oldPrice * (1 - item.discount / 100)).toFixed(2)} LE</p>
                </div>

                <div class="col-2 text-center d-flex justify-content-center">
                    <i class="fa-solid fa-xmark fs-3" onclick="removeItem(${index})"></i>
                </div>
            </div>
            `;
        }
    });

    if (content) {
        if ($(window).width() <= 768) {
            $('#responsive-table').show(); // Hide responsive table on mobile
            $('#inner-table').hide(); // Show mobile layout
        } else {
            $('#inner-table').show(); // Hide mobile layout on larger screens
            $('#responsive-table').hide(); // Show responsive table
            cartona.html(content); // Append all items in the table
        }
    } else {
        $('#inner-table, #responsive-table').hide(); // Hide both if no items are present
    }

    getPrice(getSubtotal);
}

// Trigger rendering of items on page load
$(document).ready(function () {
    renderItems();
});
