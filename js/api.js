// api.js

const BASE_URL = 'http://techyardhub.somee.com/api'; // Update with your actual API base URL

// Categories API
const CategoriesAPI = {
    async getAllCategories() {
        try {
            const response = await fetch(`${BASE_URL}/Categories/GetAllCategories`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    },

    async getCategoryById(id) {
        try {
            const response = await fetch(`${BASE_URL}/Categories/GetCategoryById/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching category with ID ${id}:`, error);
        }
    },

    async addCategory(categoryData) {
        try {
            const response = await fetch(`${BASE_URL}/Categories/AddCategory`, {
                method: 'POST',
                body: categoryData,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    },

    async updateCategory(id, categoryData) {
        try {
            const response = await fetch(`${BASE_URL}/Categories/UpdateCategory/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization header if needed
                },
                body: JSON.stringify(categoryData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error updating category with ID ${id}:`, error);
        }
    },

    async deleteCategory(id) {
        try {
            const response = await fetch(`${BASE_URL}/Categories/DeleteCategory/${id}`, {
                method: 'DELETE',
                headers: {
                    // Include authorization header if needed
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error deleting category with ID ${id}:`, error);
        }
    }
};

// Products API
const ProductsAPI = {
    async getAllProducts() {
        try {
            const response = await fetch(`${BASE_URL}/Products/GetAllProducts`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    },

    async getProductById(id) {
        try {
            const response = await fetch(`${BASE_URL}/Products/GetProductById/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
        }
    },

    async addProduct(productDto) {
        try {
            const response =await fetch(`${BASE_URL}/Products/AddProduct`, {
                method: 'POST',
                body: productDto,
                });                

            if (!response.ok) {
                const errorData = await response.statusText; // Attempt to parse error response
                console.error("Error creating product:", errorData);
                throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'No additional information available.'}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating product:", error);
        }
    },

    async updateProduct(id, productData) {
        try {
            const response = await fetch(`${BASE_URL}/Products/UpdateProduct/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authorization header if needed
                },
                body: JSON.stringify(productData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error updating product with ID ${id}:`, error);
        }
    },

    async deleteProduct(id) {
        try {
            const response = await fetch(`${BASE_URL}/Products/DeleteProduct/${id}`, {
                method: 'DELETE',
                headers: {
                    // Include authorization header if needed
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error);
        }
    },

    async getLaptops() {
        try {
            const response = await fetch(`${BASE_URL}/Products/Laptops`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching laptops:", error);
        }
    },

    async getDesktops() {
        try {
            const response = await fetch(`${BASE_URL}/Products/Desktops`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching desktops:", error);
        }
    },

    async getAccessories() {
        try {
            const response = await fetch(`${BASE_URL}/Products/Accessories`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching accessories:", error);
        }
    }
};

const AccountAPI = {
    async registerCustomer(registerData) {
        try {
            const response = await fetch(`${BASE_URL}/Account/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error registering customer:", error);
        }
    },

    async login(loginData) {
        try {
            const response = await fetch(`${BASE_URL}/Account/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();

            // If login is successful, store the token in localStorage
            if (result.status) {
                localStorage.setItem('authToken', result.Data.Token);
                localStorage.setItem('userRole', result.Data.Role);
                localStorage.setItem('userProfileImage', result.Data.ProfileImage);
            }
            return result;
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }
};

export { CategoriesAPI, ProductsAPI, AccountAPI };
