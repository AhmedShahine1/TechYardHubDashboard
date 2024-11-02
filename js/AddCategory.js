import { CategoriesAPI} from './api.js';

document.getElementById('addCategoryForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('Name', document.getElementById('categoryName').value);  
  // Image Files
  formData.append('Image', document.getElementById('categoryImage').files[0]);

  try {
    const result = await CategoriesAPI.addCategory(formData);
    console.log("Product added successfully:", result);
  } catch (error) {
    console.error("Error adding product:", error);
  }
});
