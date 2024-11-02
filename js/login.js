import { AccountAPI } from "./api.js"
$(document).ready(function () {
    document.getElementById('loginButton').addEventListener('click', function () {
        const emailOrPhone = document.getElementById('EmailOrPhone').value.trim();
        const password = document.getElementById('Password').value.trim();
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = ""; // Clear previous messages

        // Simple validation checks
        if (emailOrPhone === "") {
            loginMessage.textContent = "Please enter an email or phone number.";
            return;
        } else if (!validateEmailOrPhone(emailOrPhone)) {
            loginMessage.textContent = "Please enter a valid email or phone number.";
            return;
        }

        if (password === "") {
            loginMessage.textContent = "Please enter your password.";
            return;
        } else if (password.length < 6) {
            loginMessage.textContent = "Password should be at least 6 characters.";
            return;
        }

        login();
        // Perform login functionality here
    });

    function validateEmailOrPhone(input) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^\d{10,15}$/;
        return emailPattern.test(input) || phonePattern.test(input);
    }

    async function login() {
        const loginData = {
            EmailOrPhone: $('#EmailOrPhone').val(),
            Password: $('#Password').val()
        };

        try {
            const result = await AccountAPI.login(loginData);
            if (result.status) {
                $('#loginMessage').html(`<div class="alert alert-success">Login successful!</div>`);
                // Redirect to dashboard or another page if needed
            } else {
                $('#loginMessage').html(`<div class="alert alert-danger">${result.ErrorMessage}</div>`);
            }
        } catch (error) {
            $('#loginMessage').html(`<div class="alert alert-danger">Login failed!</div>`);
        }
    }
});
