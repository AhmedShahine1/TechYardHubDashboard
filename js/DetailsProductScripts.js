import { CategoriesAPI, ProductsAPI } from "./api.js";
$(document).ready(function () {
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
  fetchCategories();
  $(".tab-item").click(function () {
    // Remove active class from all tabs
    $(".tab-item").removeClass("active");
    $(".tab-pane").removeClass("active");

    // Add active class to clicked tab and related content
    $(this).addClass("active");
    const tabId = $(this).data("tab");
    $(`#${tabId}`).addClass("active");
  });
});

// Function to load product details based on ID
async function loadProductDetails() {
  const productId = Number(new URLSearchParams(window.location.search).get("id"));
  const product = await ProductsAPI.getProductById(productId);
  if (product) {
    // Set initial main image
    const mainImageElement = document.getElementById("mainImage");
    mainImageElement.src = product.imageUrl;
    document.getElementById("productName").innerText = product.name;
    document.getElementById("description").innerText = product.description;
    document.getElementById("productPrice").innerText = `£${(product.oldPrice * (1 - product.discount / 100)).toFixed(2)}`;

    if (product.discount > 0) {
      document.getElementById("oldPrice").innerText = `£${product.oldPrice.toFixed(2)}`;
    }

    // Load product information
    const informationList = document.getElementById("informationContent");
    informationList.innerHTML = ""; // Clear existing information

    // Populate product information based on available fields
    informationList.innerHTML += `<li><strong>Model:</strong> ${product.model ?? "N/A"}</li>`;
    informationList.innerHTML += `<li><strong>OS:</strong> ${product.os ?? "N/A"}</li>`;

    // Populate product features if available
    if (product.productFeature && product.productFeature.length > 0) {
      const feature = product.productFeature[0];
      informationList.innerHTML += `<li><strong>Processor:</strong> ${feature.processor ?? "N/A"}</li>`;
      informationList.innerHTML += `<li><strong>RAM Size:</strong> ${feature.ramSize ?? "N/A"}</li>`;
      informationList.innerHTML += `<li><strong>Storage:</strong> ${feature.storage ?? "N/A"}</li>`;
      informationList.innerHTML += `<li><strong>Dimensions:</strong> ${feature.dimensions ?? "N/A"}</li>`;
      informationList.innerHTML += `<li><strong>Weight:</strong> ${feature.weight ?? "N/A"}</li>`;
      informationList.innerHTML += `<li><strong>Screen Size:</strong> ${feature.screenSize ?? "N/A"}</li>`;
    } else {
      informationList.innerHTML += `<li><strong>Processor:</strong> N/A</li>`;
      informationList.innerHTML += `<li><strong>RAM Size:</strong> N/A</li>`;
      informationList.innerHTML += `<li><strong>Storage:</strong> N/A</li>`;
      informationList.innerHTML += `<li><strong>Dimensions:</strong> N/A</li>`;
      informationList.innerHTML += `<li><strong>Weight:</strong> N/A</li>`;
      informationList.innerHTML += `<li><strong>Screen Size:</strong> N/A</li>`;
    }

    // Add additional fields as needed
    informationList.innerHTML += `<li><strong>Rating:</strong> ${product.rating ?? "N/A"} stars</li>`;

    // Load related products (optional)
    loadRelatedProducts(product.categoriesId);

// Load thumbnails and set up click event to swap with main image
const carouselInner = $("#thumbnailCarousel .carousel-inner");
carouselInner.empty(); // Clear existing carousel items

// Array to temporarily hold thumbnail sets
let thumbnailSet = [];

// Function to create a carousel item with a set of thumbnails
function createCarouselItem(thumbnails) {
  const carouselItem = $(`
    <div class="carousel-item ${carouselInner.children().length === 0 ? 'active' : ''}">
      <div class="d-flex justify-content-between" id="thumbnailContainer">
      </div>
    </div>
  `);

  const container = carouselItem.find("#thumbnailContainer");
  thumbnails.forEach((imgElement) => container.append(imgElement));

  // Append the completed carousel item
  carouselInner.append(carouselItem);
}

// Main image setup
const mainImg = $(`
  <img
    alt="Product main thumbnail"
    class="img-fluid thumbnail"
    src="${product.imageUrl}"
  />
`);
thumbnailSet.push(mainImg);
mainImg.on("click", function () {
  const currentMainSrc = mainImageElement.src;

  // Set main image to clicked thumbnail
  mainImageElement.src = product.imageUrl;

  // Add previous main image as a thumbnail and set click event
  const newThumbnail = $(`<img alt="Product thumbnail" class="img-fluid thumbnail" src="${currentMainSrc}" />`);
  newThumbnail.on("click", function () {
    mainImageElement.src = currentMainSrc;
    newThumbnail.remove();
  });

  thumbnailSet.push(newThumbnail);
});
mainImageElement.src = product.imageUrl;

// Loop through productDetailsImages and create img elements
product.productDetailsImages.forEach((detailImage, index) => {
  index+=1;
  const imgElement = $(`
    <img
      alt="Product thumbnail"
      class="img-fluid thumbnail"
      src="${detailImage}"
    />
  `);

  // Add click event for thumbnail
  imgElement.on("click", function () {
    const currentMainSrc = mainImageElement.src;

    // Set main image to clicked thumbnail
    mainImageElement.src = detailImage;

    // Add previous main image as a thumbnail and set click event
    const newThumbnail = $(`<img alt="Product thumbnail" class="img-fluid thumbnail" src="${currentMainSrc}" />`);
    newThumbnail.on("click", function () {
      mainImageElement.src = currentMainSrc;
      newThumbnail.remove();
    });

    thumbnailSet.push(newThumbnail);
  });

  // Add the thumbnail to the set
  thumbnailSet.push(imgElement);

  // When 4 thumbnails are accumulated or it's the last item, create a new carousel item
  if ((index + 1) % 4 === 0 || index == product.productDetailsImages.length ) {
    createCarouselItem(thumbnailSet);
    thumbnailSet = []; // Clear for the next set
  }
});
  } else {
    // Handle product not found
    alert("Product not found!");
  }
}

async function loadRelatedProducts(categoryId) {
  const relatedProductsContainer = document.getElementById("relatedProductsContainer");
  relatedProductsContainer.innerHTML = ""; // Clear existing related products

  const relatedProducts = await CategoriesAPI.getProductsByCategoryId(categoryId); // Use new API method

  if (!relatedProducts || relatedProducts.length === 0) {
      relatedProductsContainer.innerHTML = "<p>No related products found.</p>";
      return;
  }
  createCarousel(relatedProducts); // Assuming createCarousel takes an array of products
}

function createCarousel(relatedProducts) {
  const screenWidth = window.innerWidth;
  const itemsPerSlide = screenWidth >= 768 ? 3 : 1; // 3 items on large screens, 1 item on small screens
  const totalSlides = Math.ceil(relatedProducts.length / itemsPerSlide);

  // Clear previous carousel items if any
  relatedProductsContainer.innerHTML = "";

  for (let i = 0; i < totalSlides; i++) {
    const slideDiv = document.createElement("div");
    slideDiv.className = "carousel-item" + (i === 0 ? " active" : "");

    const rowDiv = document.createElement("div");
    rowDiv.className = "row justify-content-center";

    for (let j = 0; j < itemsPerSlide; j++) {
      const productIndex = i * itemsPerSlide + j;
      if (productIndex < relatedProducts.length) {
        const product = relatedProducts[productIndex];
        const hasDiscount = product.discount > 0;
        const discountedPrice =
          product.oldPrice - (product.oldPrice * product.discount) / 100;

        const productCard = `
          <div class="col-12 ${itemsPerSlide === 3 ? "col-md-4" : ""
          } mb-3"> <!-- Full width on small screens, 1/3 on medium/large screens -->
            <div class="card">
              <img src="${product.imageUrl}" class="card-img-top" alt="${product.Name
          }" />
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Price: ${hasDiscount
            ? `<span style="text-decoration: line-through;">$${product.oldPrice
            }</span> <span class="text-danger">$${discountedPrice.toFixed(
              2
            )}</span>`
            : `$${product.oldPrice}`
          }
</p>
              </div>
            </div>
          </div>`;
        rowDiv.innerHTML += productCard;
      }
    }
    slideDiv.appendChild(rowDiv);
    relatedProductsContainer.appendChild(slideDiv);
  }
}

// Load product details on page load
window.onload = loadProductDetails;
window.addEventListener("resize", loadProductDetails);
