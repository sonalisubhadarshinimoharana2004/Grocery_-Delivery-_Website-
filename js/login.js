const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  // Get registered users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check whether the user exists
  const user = users.find(function (user) {
    return (
      String(user.email || "").toLowerCase() === email &&
      user.password === password
    );
  });

  if (user) {
    loginMessage.textContent = "Login successful!";
    loginMessage.className = "text-center mt-4 text-green-600 font-semibold";

    // Save logged-in user details
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Redirect to home page after successful login
    setTimeout(function () {
      window.location.href = "index.html";
    }, 1000);
  } else {
    loginMessage.textContent = "Invalid email or password!";
    loginMessage.className = "text-center mt-4 text-red-600 font-semibold";
  }
});
