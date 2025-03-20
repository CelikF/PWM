// login_validation.js

document.addEventListener("templatesLoaded", function() {
  console.log("login_validation started (templatesLoaded)");

  // Select the login form (it must be present in the loaded template)
  const loginForm = document.querySelector(".sign-in-container form");
  if (!loginForm) {
    console.error("Login form not found.");
    return;
  }

  // Add a submit event listener to the form
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Extract the field values
    const usernameOrEmail = loginForm.querySelector("input[name='username/email']").value.trim();
    const password = loginForm.querySelector("input[name='password']").value;

    // Debug log: password entered by the user
    console.log("User-entered password:", password);

    // Validate the fields
    if (!usernameOrEmail) {
      displayError("Please enter your username or email.");
      return;
    }
    if (!password) {
      displayError("Please enter your password.");
      return;
    }
    if (usernameOrEmail.includes("@") && !isValidEmail(usernameOrEmail)) {
      displayError("Please enter a valid email address.");
      return;
    }
    
    // Call the loginUser function (defined in script_auth.js, which must be loaded beforehand)
    const result = loginUser(usernameOrEmail, password);
    
    if (result.success) {
      // Debug log: actual stored password for the user
      console.log("Stored user password:", result.user.password);
      alert(result.message);
      // Redirect to home.html only if login is successful
      window.location.href = 'home.html';
    } else {
      displayError(result.message);
    }
  });

  // Function to display error messages
  function displayError(message) {
    const errorDiv = loginForm.querySelector(".error-message");
    if (errorDiv) {
      errorDiv.textContent = message;
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
