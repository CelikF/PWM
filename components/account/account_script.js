window.addEventListener("DOMContentLoaded", async function() {
    // Function to load the database
    async function loadDatabase() {
      try {
        //const storedDB = localStorage.getItem('database');
        //if (storedDB) {
        //  database = JSON.parse(storedDB);
        //  console.log('Database loaded from localStorage:', database);
        //} else {
          const response = await fetch('./db/db.json');
          if (!response.ok) {
            throw new Error('Unable to load the database.');
          }
          database = await response.json();
          console.log('Database loaded from JSON file:', database);
          localStorage.setItem('database', JSON.stringify(database));
        //}
      } catch (error) {
        console.error("Error loading the database:", error);
      }
    }
  
    // Load the database (from file or localStorage)
    await loadDatabase();
  
    const accountProfilePic = document.getElementById("account-profile-pic");
    const accountName = document.getElementById("account-username");
    const accountEmail = document.getElementById("account-email");

    if (accountProfilePic && accountName && accountEmail) {
      console.log("yes");
      const account = database.users[0]; // Assume we take the first user as an example
      accountProfilePic.src = account["image"];
      accountName.textContent = account["username"];
      accountEmail.textContent = account["email"];
    } else {
      console.error("Desktop elements not found");
    }
});