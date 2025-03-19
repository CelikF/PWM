document.addEventListener("templatesLoaded", function() {
  // Inizializza Flatpickr sul campo #datePicker, ora che il template è caricato
  const datePickerEl = document.querySelector("#datePicker");
  if (datePickerEl) {
    flatpickr(datePickerEl, {
      dateFormat: "m/d/Y", // Formato: MM/DD/YYYY
      allowInput: true
    });
  } else {
    console.log("DatePicker element not found");
  }

  // Popola il select delle ore (1..12)
  const hourSelect = document.getElementById("hourSelect");
  if (hourSelect) {
    for (let h = 1; h <= 12; h++) {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      hourSelect.appendChild(opt);
    }
  }

  // Popola il select dei minuti (00..59)
  const minuteSelect = document.getElementById("minuteSelect");
  if (minuteSelect) {
    for (let m = 0; m < 60; m++) {
      const opt = document.createElement("option");
      opt.value = m.toString().padStart(2, "0");
      opt.textContent = m.toString().padStart(2, "0");
      minuteSelect.appendChild(opt);
    }
  }

  // Esempio di gestione del pulsante di chiusura
  const closeBtn = document.querySelector(".dateTimeModal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      // Chiude la modale (in questo caso nasconde l'elemento)
      const modalEl = document.querySelector(".dateTimeModal");
      if (modalEl) {
        modalEl.style.display = "none";
      }
    });
  }
});
