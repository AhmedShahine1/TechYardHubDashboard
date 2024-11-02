import { CategoriesAPI, ProductsAPI } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Populate the categories dropdown
  const categoriesDropdown = document.getElementById('categoriesId');
  try {
    const categories = await CategoriesAPI.getAllCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categoriesDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
});

document.getElementById('addImageButton').addEventListener('click', () => {
  const container = document.getElementById('additionalImagesContainer');
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'productDetailsImage[]';
  input.classList.add('additional-image');
  container.appendChild(input);
});

document.getElementById('addProductForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('Name', document.getElementById('name').value);
  formData.append('Description', document.getElementById('description').value);
  formData.append('OldPrice', parseFloat(document.getElementById('oldPrice').value) || 0);
  formData.append('Discount', parseInt(document.getElementById('discount').value) || 0);
  formData.append('categoriesId', parseInt(document.getElementById('categoriesId').value) || 0);
  formData.append('Model', document.getElementById('model').value);
  formData.append('OS', document.getElementById('os').value);
  formData.append('SoldOut', document.getElementById('soldOut').checked);
  formData.append('Popular', document.getElementById('popular').checked);
  
  // Image Files
  formData.append('Image', document.getElementById('image').files[0]);
  formData.append('ImageInHover', document.getElementById('imageInHover').files[0]);

  // Additional Images
  const additionalImages = document.querySelectorAll('.additional-image');
  additionalImages.forEach((fileInput) => {
    if (fileInput.files[0]) {
      formData.append('ProductDetailsImage', fileInput.files[0]);
    }
  });

  try {
    const result = await ProductsAPI.addProduct(formData);
    console.log("Product added successfully:", result);
  } catch (error) {
    console.error("Error adding product:", error);
  }
});
