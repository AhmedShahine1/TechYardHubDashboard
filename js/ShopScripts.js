import { CategoriesAPI, ProductsAPI } from "./api.js";

$(document).ready(function () {

});
$(document).ready(async function () {
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
  let layout = "3"; // Default layout
  const categories = await CategoriesAPI.getAllCategories();

  const allProducts = await ProductsAPI.getAllProducts();
  console.log(allProducts);
  function getMinMaxPrice(products) {
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    products.forEach((product) => {
      // Calculate the effective price after applying any discount
      const effectivePrice = product.oldPrice * (1 - product.discount / 100);

      // Update minPrice and maxPrice based on effectivePrice
      if (effectivePrice < minPrice) {
        minPrice = effectivePrice;
      }
      if (effectivePrice > maxPrice) {
        maxPrice = effectivePrice;
      }
    });

    return { minPrice, maxPrice };
  }

  // Usage
  const { minPrice, maxPrice } = getMinMaxPrice(allProducts);

  // Sort Products
  function sortProducts(products, criteria) {
    switch (criteria) {
      case "price-asc":
        return products.sort((a, b) => a.oldPrice - b.oldPrice);
      case "price-desc":
        return products.sort((a, b) => b.oldPrice - a.oldPrice);
      case "name-asc":
        return products.sort((a, b) => a.Name.localeCompare(b.Name));
      case "name-desc":
        return products.sort((a, b) => b.Name.localeCompare(a.Name));
      default:
        return products; // Default sorting
    }
  }

// Extract unique filter values from product data
function getUniqueValues(property) {
  if (property === "categoriesId") {
    // Map categoriesId to actual category names
    return [
      ...new Set(
        allProducts.map((product) => {
          const category = categories.find(
            (cat) => cat.id === product.categoriesId
          );
          return category ? category : null;
        })
      ),
    ].filter(Boolean); // Filter out any null values
  } else if (property === "productFeature.processor" || 
             property === "productFeature.ramSize" || 
             property === "productFeature.screenSize" || 
             property === "productFeature.storage") {
    // Handle properties within the productFeature array
    return [
      ...new Set(
        allProducts.flatMap((product) =>
          product.productFeature.map((feature) => feature[property.split(".")[1]])
        )
      ),
    ].filter(Boolean); // Filter out any undefined or null values
  } else {
    // Generic case for other properties directly on the product object
    return [...new Set(allProducts.map((product) => product[property]))];
  }
}

  function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('Category');
    return category;
  }

  function populateFilters() {
    const processorOptions = getUniqueValues("productFeature.processor");
    const categoryOptions = getUniqueValues("categoriesId");
    const ramOptions = getUniqueValues("productFeature.ramSize");
    const screenSizeOptions = getUniqueValues("productFeature.screenSize");
    const storageOptions = getUniqueValues("productFeature.storage");
    const urlCategory = getCategoryFromUrl();
    const selectedCategory = urlCategory || "all";

    const filterHTML = `
    <!-- Category Filter -->
    <label for="categoryFilter">Category:</label>
    <select id="categoryFilter" class="form-select">
      <option value="all" ${selectedCategory === "all" ? "selected" : ""}>All</option>
      ${categoryOptions
        .map((category) => `<option value="${category.id}" ${selectedCategory === category.name ? "selected" : ""}>${category.name}</option>`)
        .join("")}
    </select>

    <!-- Processor Filter -->
    <label for="processorFilter">Processor:</label>
    <select id="processorFilter" class="form-select">
      <option value="all">All</option>
      ${processorOptions
        .map((proc) => `<option value="${proc}">${proc}</option>`)
        .join("")}
    </select>

    <!-- Price Range Filter -->
    <label for="priceRange">Price Range:</label>
    <input type="text" id="priceRange" name="price" value="" />

    <!-- RAM Filter -->
    <label for="ramFilter">RAM:</label>
    <select id="ramFilter" class="form-select">
      <option value="all">All</option>
      ${ramOptions
        .map((ram) => `<option value="${ram}">${ram}</option>`)
        .join("")}
    </select>

    <!-- Screen Size Filter -->
    <label for="screenSizeFilter">Screen Size:</label>
    <select id="screenSizeFilter" class="form-select">
      <option value="all">All</option>
      ${screenSizeOptions
        .map((size) => `<option value="${size}">${size}</option>`)
        .join("")}
    </select>

    <!-- Storage Filter -->
    <label for="storageFilter">Storage:</label>
    <select id="storageFilter" class="form-select">
      <option value="all">All</option>
      ${storageOptions
        .map((storage) => `<option value="${storage}">${storage}</option>`)
        .join("")}
    </select>
  `;

    $("#dynamicFilters").html(filterHTML);
  }

  function setrange() {
    $("#priceRange").ionRangeSlider({
      type: "double",
      min: minPrice - 50,
      max: maxPrice + 50,
      from: minPrice,
      to: maxPrice,
      step: 50,
      prefix: "$",
      prettify_enabled: true,
      grid: true,
      onFinish: function (data) {
        // Call displayProducts with the selected price range
        displayProducts(allProducts, data.from, data.to);
      },
    });
  }

  // Function to set product grid class based on selected layout
  function setGridLayout(newLayout) {
    layout = newLayout;
    $("#productGrid").removeClass().addClass("row");

    if (newLayout === "list") {
      $("#productGrid").addClass("list-view");
    } else if (newLayout === "3") {
      $("#productGrid").addClass("grid-3");
    } else if (newLayout === "5") {
      $("#productGrid").addClass("grid-5");
    }
  }

  // Function to display products based on selected filters
  function displayProducts(
    products = allProducts,
    minPrice = 0,
    maxPrice = Infinity
) {
    const processor = $("#processorFilter").val();
    const category = $("#categoryFilter").val();
    const color = $("#colorFilter").val();
    const ram = $("#ramFilter").val();
    const screenSize = $("#screenSizeFilter").val();
    const storage = $("#storageFilter").val();

    $("#productGrid").empty();

    products.forEach((product) => {
        let showProduct = true;
        const effectivePrice = product.oldPrice * (1 - product.discount / 100);

        // Filter by processor if productFeature exists
        if (processor !== "all") {
            if (
                !product.productFeature ||
                !product.productFeature.some((feature) => feature.processor === processor)
            ) {
                showProduct = false;
            }
        }

        // Filter by category
        if (category !== "all" && product.categoriesId != category) showProduct = false;

        // Filter by price range
        if (effectivePrice < minPrice || effectivePrice > maxPrice) showProduct = false;

        // Filter by color
        if (color !== "all" && product.color !== color) showProduct = false;

        // Filter by RAM if productFeature exists
        if (ram !== "all") {
            if (
                !product.productFeature ||
                !product.productFeature.some((feature) => feature.ramSize == ram)
            ) {
                showProduct = false;
            }
        }

        // Filter by screen size if productFeature exists
        if (screenSize !== "all") {
            if (
                !product.productFeature ||
                !product.productFeature.some((feature) => feature.screenSize == screenSize)
            ) {
                showProduct = false;
            }
        }

        // Filter by storage if productFeature exists
        if (storage !== "all") {
            if (
                !product.productFeature ||
                !product.productFeature.some((feature) => feature.storage == storage)
            ) {
                showProduct = false;
            }
        }

      if (showProduct) {
        const hasDiscount = product.discount > 0;
        const discountedPrice =
          product.oldPrice - (product.oldPrice * product.discount) / 100;

        const productCard = `
        <div class="product-card">
          <div class="card">
            <div class="backgroundImage">
                  <img src="${product.imageUrl}" class="card-img-top" alt="${
                product.Name
              }">
              </div>
              <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">
                Price: ${hasDiscount
            ? `<span style="text-decoration: line-through;">$${product.oldPrice
            }</span> <span class="text-danger">$${discountedPrice.toFixed(
              2
            )}</span>`
            : `$${product.oldPrice}`
          }
              </p>
              ${hasDiscount
            ? `<p class="card-text text-success">Discount: ${product.discount}%</p>`
            : ""
          }
              <p class="card-text">model: ${product.model}</p>
              <p class="card-text">
                  ${product.productFeature && product.productFeature.length > 0 
                      ? `Processor: ${product.productFeature[0].processor}` 
                      : `OS: ${product.os}`}
              </p>
              <div class="d-flex justify-content-between">
                <a href="#" class="btn btn-primary w-100 mx-1" style="animation: heightChange 0.3s ease;">Add to Cart</a>
                <a href="DetailsProduct.html?id=${product.id
          }" class="btn btn-secondary w-100 mx-1" style="animation: heightChange 0.3s ease;">View Details</a>
              </div>
            </div>
          </div>
        </div>
      `;
        $("#productGrid").append(productCard);
      }
    });

    // List view adjustments
    if (layout === "list") {
      $(".product-card").css({
        display: "flex",
        alignItems: "center",
        marginBottom: "15px",
      });
      $(".card").css({
        flex: "1",
        display: "flex",
        justifyContent: "space-between",
      });
    }
  }

  // Initialize filters and product display
  populateFilters();
  setGridLayout("3"); // Set default layout to 3 columns
  displayProducts();

  // Event handlers for layout buttons
  $("#layout3Col").click(function () {
    setGridLayout("3");
    displayProducts();
  });

  $("#layout5Col").click(function () {
    setGridLayout("5");
    displayProducts();
  });
  // Filter products on change of any filter option
  $("#dynamicFilters").on("change", 'select, input[type="range"]', function () {
    displayProducts();
  });
  // Sorting functionality
  $("#sortProducts").on("change", function () {
    const sortValue = $(this).val();
    const sortedProducts = sortProducts([...allProducts], sortValue);
    displayProducts(sortedProducts);
  });

  // Show and hide sidebar when "Filter" button is clicked
  $("#filterToggle").on("click", function () {
    $("#sidebarFilter").toggle();
    setrange();
  });

  // Hide sidebar when "X" button is clicked
  $("#closeToggle").on("click", function () {
    $("#sidebarFilter").toggle();
  });

  function checkScreenSize() {
    const windowWidth = $(window).width();

    if (windowWidth <= 768) {
      setGridLayout("list");
      displayProducts();
      $("#layout3Col, #layout5Col, #layoutList").hide();
    } else {
      $("#layout3Col, #layout5Col").show();
    }
  }

  checkScreenSize();

  $(window).resize(function () {
    checkScreenSize();
  });
});