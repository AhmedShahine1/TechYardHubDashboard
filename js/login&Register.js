import{AccountAPI}from "./api.js"

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
// jQuery for handling form submissions
$(document).ready(function () {
    // Handle registration form submission
    $('#registerForm').on('submit', async function (event) {
        event.preventDefault();

        // Collect form data
        const registerData = {
            FullName: $('#fullName').val(),
            Email: $('#email').val(),
            PhoneNumber: $('#phoneNumber').val(),
            Password: $('#password').val(),
            ConfirmPassword: $('#confirmPassword').val(),
        };

        // Call register API
        const result = await AccountAPI.registerCustomer(registerData);
        if (result && result.status) {
            alert('Registration successful!');
            // Optionally redirect or clear form
        } else {
            alert(`Registration failed: ${result.ErrorMessage}`);
        }
    });

    // Handle login form submission
    $('#loginForm').on('submit', async function (event) {
        event.preventDefault();

        // Collect form data
        const loginData = {
            PhoneNumberOrEmail: $('#EmailOrPhone').val(),
            Password: $('#Password').val(),
            RememberMe: $('#RememberMe').is(':checked')
        };

        // Call login API
        const result = await AccountAPI.login(loginData);
        if (result && result.status) {
            alert('Login successful!');
            // Store token or handle redirection
        } else {
            alert(`Login failed: ${result.ErrorMessage}`);
        }
    });
});
