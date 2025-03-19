document.addEventListener("templatesLoaded", function() {
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const container = document.getElementById("container");
    console.log("Evento arrivato");

  if (signUpButton && signInButton && container) {
    signUpButton.addEventListener("click", function() {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", function() {
      container.classList.remove("right-panel-active");
    });
  } else {
    console.error("Elementi non trovati: verifica che il template sia stato correttamente caricato.");
  }
});

