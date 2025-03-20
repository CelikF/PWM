document.addEventListener("templatesLoaded", function() {
 console.log("haha");
});

function initMap() {
  console.log("map avviata!");
  // il resto del codice per inizializzare la mappa...
  	console.log("map avviata!");
    let myMap = null;
    let marker = null;
    const mapModal = document.getElementById('mapModal');
    if (mapModal) {
      mapModal.addEventListener('shown.bs.modal', function () {
        if (!myMap) {
          // Inizializza la mappa con coordinate statiche, ad esempio [33.5207, -86.8025]
          myMap = L.map('map').setView([33.5207, -86.8025], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(myMap);
          marker = L.marker([33.5207, -86.8025]).addTo(myMap);
          marker.bindPopup("Static location").openPopup();

          // Aggiunge il controllo di ricerca (Leaflet Control Geocoder)
          if (L.Control.Geocoder) {
            const geocoderControl = L.Control.geocoder({
              defaultMarkGeocode: true,
              placeholder: 'Search for location...',
              errorMessage: 'Nothing found.',
              geocoder: L.Control.Geocoder.nominatim()
            }).addTo(myMap);

            geocoderControl.on('markgeocode', function(e) {
              const center = e.geocode.center;
              myMap.setView(center, 13);
              marker.setLatLng(center);
              marker.bindPopup(e.geocode.name).openPopup();
            });
          }
        } else {
          myMap.invalidateSize();
        }
      });
    };
};

if (document.readyState === "complete" || document.readyState === "interactive") {
  // Se il documento è già pronto, esegui subito
  initMap();
} else {
  // Altrimenti, attendi l'evento "templatesLoaded"
  document.addEventListener("templatesLoaded", initMap);
}
