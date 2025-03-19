// Variabile globale per il database
let database = null;

// Funzione per caricare il file JSON e salvarlo in 'database' e in localStorage
async function loadDatabase() {
  try {
    // Verifica se è già presente in localStorage
    const storedDB = localStorage.getItem('database');
    if (storedDB) {
      database = JSON.parse(storedDB);
      console.log('Database caricato da localStorage:', database);
    } else {
      const response = await fetch('../../db/db.json');
      if (!response.ok) {
        throw new Error('Non è stato possibile caricare il database.');
      }
      database = await response.json();
      console.log('Database caricato dal file JSON:', database);
      // Salva in localStorage per persistenza
      localStorage.setItem('database', JSON.stringify(database));
    }
  } catch (error) {
    console.error("Errore durante il caricamento del database:", error);
  }
}

// Funzione per validare il formato email
function isValidEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// Funzione per validare la password: almeno 6 caratteri e almeno un carattere speciale
function isValidPassword(password) {
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  return password.length >= 6 && specialCharRegex.test(password);
}

// Funzione per registrare un nuovo utente
function registerUser(username, email, password) {
  if (!username || !email || !password) {
    return { success: false, message: "Tutti i campi sono obbligatori." };
  }
  if (!isValidEmail(email)) {
    return { success: false, message: "Email non valida." };
  }
  if (!isValidPassword(password)) {
    return { success: false, message: "La password deve contenere almeno 6 caratteri e almeno un carattere speciale." };
  }
  // Verifica che non esista già un utente con lo stesso username o email
  const userExists = database.users.some(u => u.username === username || u.email === email);
  if (userExists) {
    return { success: false, message: "Username o email già esistente." };
  }
  // Assegna un nuovo ID all'utente
  const newId = database.users.length > 0 ? Math.max(...database.users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    image: "https://example.com/images/default.jpg", // immagine di default
    username: username,
    email: email,
    password: password, // In una produzione reale la password va criptata
    created_events: [],
    attending_events: {}
  };

  database.users.push(newUser);
  // Aggiorna localStorage per simulare il salvataggio "persistente"
  localStorage.setItem('database', JSON.stringify(database));
  console.log("Utente registrato:", newUser);
  return { success: true, message: "Registrazione avvenuta con successo.", user: newUser };
}

// Funzione per effettuare il login
function loginUser(usernameOrEmail, password) {
  if (!usernameOrEmail || !password) {
    return { success: false, message: "Inserisci username/email e password." };
  }
  if (password.length < 6) {
    return { success: false, message: "Password troppo corta." };
  }
  const user = database.users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
  if (!user) {
    return { success: false, message: "Utente non trovato." };
  }
  if (user.password !== password) {
    return { success: false, message: "Password errata." };
  }
  console.log("Login effettuato:", user);
  return { success: true, message: "Login avvenuto con successo.", user: user };
}

// Event listeners per i form di registrazione e login
document.addEventListener("DOMContentLoaded", async function() {
  // Carica il database (dal file o da localStorage)
  await loadDatabase();

  // Registrazione
  const regForm = document.querySelector(".sign-up-container form");
  if (regForm) {
    regForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const username = regForm.querySelector("input[name='username']").value.trim();
      const email = regForm.querySelector("input[name='email']").value.trim();
      const password = regForm.querySelector("input[name='password']").value;
      
      const result = registerUser(username, email, password);
      alert(result.message);
      
      if (result.success) {
        // Opzionale: reset della form o reindirizzamento
        regForm.reset();
      }
    });
  }

  // Login
  const loginForm = document.querySelector(".sign-in-container form");
  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const usernameOrEmail = loginForm.querySelector("input[name='username/email']").value.trim();
      const password = loginForm.querySelector("input[name='password']").value;
      
      const result = loginUser(usernameOrEmail, password);
      if (!result.success) {
        const errorDiv = loginForm.querySelector(".error-message");
        if (errorDiv) {
          errorDiv.textContent = result.message;
        } else {
          alert(result.message);
        }
      } else {
        alert(result.message);
        // Opzionale: esegui altre operazioni in caso di login riuscito
      }
    });
  }
});
