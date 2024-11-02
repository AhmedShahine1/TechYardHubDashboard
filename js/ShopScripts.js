import { CategoriesAPI, ProductsAPI } from "../js/api.js";

$(document).ready(function () {
  // Populate the carousel dynamically
  const indicatorsContainer = $("#announcementSection .carousel-indicators");
  const innerContainer = $("#announcementSection.carousel-inner");
  carouselData.forEach((item, index) => {
    // Create indicator buttons
    const indicator = $("<button>")
      .attr("type", "button")
      .attr("data-bs-target", "#dynamicCarousel")
      .attr("data-bs-slide-to", index)
      .attr("aria-label", item.caption);

    if (index === 0) {
      indicator.addClass("active").attr("aria-current", "true");
    }

    // Create carousel items
    const carouselItem = $("<div>")
      .addClass("carousel-item")
      .append(
        $("<img>")
          .attr("src", item.src)
          .attr("alt", item.alt)
          .addClass("d-block w-100")
      );

    if (index === 0) {
      carouselItem.addClass("active");
    }

    // Append indicators and carousel items to the DOM
    indicatorsContainer.append(indicator);
    innerContainer.append(carouselItem);
  });

  // Ensure the carousel loops (cycle) continuously
  $("#dynamicCarousel").carousel({
    interval: 2000, // Change slide every 2 seconds
    wrap: true, // Enable continuous cycling
  });
});
$(document).ready(async function () {
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
      ];
    } else {
      // Generic case for other properties
      return [...new Set(allProducts.map((product) => product[property]))];
    }
  }
  function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('Category');
    return category;
}

  function populateFilters() {
    const processorOptions = getUniqueValues("processor");
    const categoryOptions = getUniqueValues("categoriesId");
    const colorOptions = getUniqueValues("color");
    const ramOptions = getUniqueValues("ramSize");
    const screenSizeOptions = getUniqueValues("ScreenSize");
    const storageOptions = getUniqueValues("storage");
    const urlCategory = getCategoryFromUrl();
    const selectedCategory = urlCategory || "all";
    const filterHTML = `
<!-- Category Filter -->
      <label for="categoryFilter">Category:</label>
      <select id="categoryFilter" class="form-select">
        <option value="all" ${selectedCategory === "all" ? "selected" : ""}>All</option>
        ${categoryOptions
          .map((categ) => `<option value="${categ.id}" ${selectedCategory === categ.name? "selected" : ""}>${categ.name}</option>`)
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
  
      <!-- Price Filter -->
      <!-- Price Range Filter -->
      <label for="priceRange">Price Range:</label>
      <input type="text" id="priceRange" name="price" value="" />

      <!-- Color Filter -->
      <label for="colorFilter">Color:</label>
      <select id="colorFilter" class="form-select">
        <option value="all">All</option>
        ${colorOptions
          .map((color) => `<option value="${color}">${color}</option>`)
          .join("")}
      </select>
  
      <!-- RAM Filter -->
      <label for="ramFilter">RAM:</label>
      <select id="ramFilter" class="form-select">
        <option value="all">All</option>
        ${ramOptions
          .map((ram) => `<option value="${ram}">${ram} GB</option>`)
          .join("")}
      </select>
  
      <!-- Screen Size Filter -->
      <label for="screenSizeFilter">Screen Size:</label>
      <select id="screenSizeFilter" class="form-select">
        <option value="all">All</option>
        ${screenSizeOptions
          .map((size) => `<option value="${size}">${size} inch</option>`)
          .join("")}
      </select>
  
      <!-- Storage Filter -->
      <label for="storageFilter">Storage:</label>
      <select id="storageFilter" class="form-select">
        <option value="all">All</option>
        ${storageOptions
          .map((storage) => `<option value="${storage}">${storage} GB</option>`)
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
      // Calculate the effective price with discount
      const effectivePrice = product.oldPrice * (1 - product.discount / 100);
      // Filter conditions
      if (processor !== "all" && product.processor !== processor)
        showProduct = false;
      if (category !== "all" && product.categoriesId != category)
        showProduct = false;
      if (effectivePrice < minPrice || effectivePrice > maxPrice)
        showProduct = false;
      if (color !== "all" && product.color !== color) showProduct = false;
      if (ram !== "all" && product.ramSize != ram) showProduct = false;
      if (screenSize !== "all" && product.ScreenSize != screenSize)
        showProduct = false;
      if (storage !== "all" && product.storage != storage) showProduct = false;

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
                Price: ${
                  hasDiscount
                    ? `<span style="text-decoration: line-through;">$${
                        product.oldPrice
                      }</span> <span class="text-danger">$${discountedPrice.toFixed(
                        2
                      )}</span>`
                    : `$${product.oldPrice}`
                }
              </p>
              ${
                hasDiscount
                  ? `<p class="card-text text-success">Discount: ${product.discount}%</p>`
                  : ""
              }
              <p class="card-text">model: ${product.model}</p>
              <p class="card-text">os: ${product.os}</p>
              <div class="d-flex justify-content-between">
                <a href="#" class="btn btn-primary w-100 mx-1" style="animation: heightChange 0.3s ease;">Add to Cart</a>
                <a href="DetailsProduct.html?id=${
                  product.id
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

  $("#layoutList").click(function () {
    setGridLayout("list");
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
  $("#closeSidebar").on("click", function () {
    $("#sidebarFilter").hide();
  });

  function checkScreenSize() {
    const windowWidth = $(window).width();

    if (windowWidth <= 768) {
      setGridLayout("list");
      displayProducts();
      $("#layout3Col, #layout5Col, #layoutList").hide();
    } else {
      $("#layout3Col, #layout5Col, #layoutList").show();
    }
  }

  checkScreenSize();

  $(window).resize(function () {
    checkScreenSize();
  });
});




