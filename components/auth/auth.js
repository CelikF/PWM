// Gestione dell'evento "templatesLoaded"
document.addEventListener("templatesLoaded", function() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 768) {
    // --- LOGICA MOBILE ---
    // Usa gli id corretti per la sezione mobile
    const mobileLoginBtn = document.getElementById("tab-login");
    const mobileSignupBtn = document.getElementById("tab-signup");
    const mobileLoginForm = document.getElementById("mobile-login-form");
    const mobileSignupForm = document.getElementById("mobile-signup-form");

    if (mobileLoginBtn && mobileSignupBtn && mobileLoginForm && mobileSignupForm) {
      mobileLoginBtn.addEventListener("click", function() {
        mobileLoginBtn.classList.add("active");
        mobileSignupBtn.classList.remove("active");
        mobileLoginForm.classList.add("active");
        mobileSignupForm.classList.remove("active");
      });

      mobileSignupBtn.addEventListener("click", function() {
        mobileSignupBtn.classList.add("active");
        mobileLoginBtn.classList.remove("active");
        mobileSignupForm.classList.add("active");
        mobileLoginForm.classList.remove("active");
      });
    } else {
      console.error("Elementi mobile non trovati");
    }
  } else {
    // --- LOGICA DESKTOP (e iPad) ---
    const desktopSignUpBtn = document.getElementById("signUp");
    const desktopSignInBtn = document.getElementById("signIn");
    const container = document.getElementById("container");

    if (desktopSignUpBtn && desktopSignInBtn && container) {
      desktopSignUpBtn.addEventListener("click", function() {
        container.classList.add("right-panel-active");
      });
      desktopSignInBtn.addEventListener("click", function() {
        container.classList.remove("right-panel-active");
      });
    } else {
      console.error("Elementi desktop non trovati");
    }
  }
});