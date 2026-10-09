const registerForm = document.getElementById("registerForm");

const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPhone = document.getElementById("regPhone");
const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = regName.value.trim();
    const email = regEmail.value.trim().toLowerCase();
    const phone = regPhone.value.trim();
    const password = regPassword.value;
    const confirmPassword = regConfirmPassword.value;

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phone)) {
        registerMessage.textContent = "Enter a valid 10-digit phone number!";
        registerMessage.className =
            "text-center mt-4 text-red-600 font-semibold";
        return;
    }

    // Validate password length
    if (password.length < 6) {
        registerMessage.textContent =
            "Password must contain at least 6 characters!";
        registerMessage.className =
            "text-center mt-4 text-red-600 font-semibold";
        return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match!";
        registerMessage.className =
            "text-center mt-4 text-red-600 font-semibold";
        return;
    }

    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check whether the email is already registered
    const existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {
        registerMessage.textContent =
            "This email is already registered. Please login!";
        registerMessage.className =
            "text-center mt-4 text-red-600 font-semibold";
        return;
    }

    // Create new user
    const newUser = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    // Save user in localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Show success message
    registerMessage.textContent =
        "Registration successful! Redirecting to login...";
    registerMessage.className =
        "text-center mt-4 text-green-600 font-semibold";

    // Reset form
    registerForm.reset();

    // Redirect to login page
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1500);
});