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

    async addProduct(productData) {
        try {
            const response = await fetch(`${BASE_URL}/Products/AddProduct`, {
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
            console.error("Error adding product:", error);
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
    }
};

// Account API
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
            return await response.json();
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }
};

// Exporting the APIs
export { CategoriesAPI, ProductsAPI, AccountAPI };
