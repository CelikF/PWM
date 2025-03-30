document.addEventListener("DOMContentLoaded", async function () {
  // Function to load the database
  async function loadDatabase() {
      try {
          const storedDB = localStorage.getItem('database');
          if (storedDB) {
              database = JSON.parse(storedDB);
              console.log('Database loaded from localStorage:', database);
          } else {
              const response = await fetch('components/account/account.json');
              if (!response.ok) {
                  throw new Error('Unable to load the database.');
              }
              database = await response.json();
              console.log('Database loaded from JSON file:', database);
              localStorage.setItem('database', JSON.stringify(database));
          }
      } catch (error) {
          console.error("Error loading the database:", error);
      }
  }

  // Load the database (from file or localStorage)
  await loadDatabase();

  // --- DESKTOP LOGIC ---
  const desktopProfilePic = document.getElementById("desktop-profile-pic");
  const desktopName = document.getElementById("desktop-name");
  const desktopEmail = document.getElementById("desktop-email");

  if (desktopProfilePic && desktopName && desktopEmail) {
      const account = database?.users?.[0]; // Ensure safety when accessing properties
      if (account) {
          desktopProfilePic.src = account.profile_pic;
          desktopName.textContent = account.name;
          desktopEmail.textContent = account.email;
      } else {
          console.error("No users found in the database");
      }
  } else {
      console.error("Desktop elements not found");
  }
});
