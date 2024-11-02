import { CategoriesAPI } from './api.js';
$(document).ready(function () {
    // Call the API to get all categories
    CategoriesAPI.getAllCategories()
        .then(function (result) {
            // Loop through each category returned from the API
            $('#categoryTableBody').empty(); // Correct method to clear the table body
            result.forEach(function (category) {
                $('#categoryTableBody').append(`
                    <tr>
                        <td>${category.name}</td>
                        <td><img src="${category.imageUrl}" alt="${category.name}" style="width: 100px; height: auto;"></td>
                    </tr>
                `);
            });
        })
        .catch(function (error) {
            console.error('Error fetching categories:', error);
            $('#categoryTableBody').append(`
                <tr>
                    <td colspan="2">Failed to load categories.</td>
                </tr>
            `);
        });
});
