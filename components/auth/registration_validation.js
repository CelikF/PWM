// registration_validation.js

document.addEventListener("templatesLoaded", function() {
  console.log("registration_validation started (templatesLoaded)");

  // Select the registration form
  const regForm = document.querySelector(".sign-up-container form");
  if (!regForm) {
    console.error("Registration form not found.");
    return;
  }

  // Add a submit event listener to the registration form
  regForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Extract the field values
    const username = regForm.querySelector("input[name='username']").value.trim();
    const email = regForm.querySelector("input[name='email']").value.trim();
    const password = regForm.querySelector("input[name='password']").value;
    
    // Get the role based on the switch input (checkbox named "chisono")
    const roleCheckbox = regForm.querySelector("input[name='chisono']");
    const role = roleCheckbox && roleCheckbox.checked ? "User" : "Promoter";

    // Debug log: registration data entered by the user
    console.log("Registration data entered:", { username, email, password, role });

    // Validate the fields
    if (!username) {
      displayError("Please enter a username.");
      return;
    }
    if (!email) {
      displayError("Please enter an email.");
      return;
    }
    if (!password) {
      displayError("Please enter a password.");
      return;
    }
    if (!isValidEmail(email)) {
      displayError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      displayError("Password must be at least 6 characters long.");
      return;
    }
    
    // Call the registerUser function (from script_auth.js, updated to accept a role)
    const result = registerUser(username, email, password, role);
	
    if (!result.success) {
      displayError(result.message);
    } else {
      // Debug log: show the newly registered user
      console.log("User registered successfully:", result.user);
      localStorage.setItem('loggedInUser', JSON.stringify(result.user));

      alert(result.message);
      window.location.href = 'home.html';

      regForm.reset();
      // Here you can add a redirect or leave the user on the same page
    }
  });

  // Function to display error messages
  function displayError(message) {
    // If a specific error container exists, use it; otherwise, use alert
    const errorSpan = regForm.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = message;
    } else {
      alert(message);
    }
  }

  // Function to validate the email format
  function isValidEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
});
