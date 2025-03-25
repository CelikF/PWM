document.addEventListener('DOMContentLoaded', function () {
    // Fetch events from events.json
    fetch('./components/event/events.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(events => {
        if (events.length > 0) {
          // Use the first event from the JSON file
          const event = events[0];
  
          // Inject the event description
          const descriptionElement = document.getElementById('event-description');
          if (descriptionElement) {
            descriptionElement.textContent = event.description;
          } else {
            console.error('No element with id "event-description" found.');
          }
  
          // Inject the event location
          const locationElement = document.getElementById('event-location');
          if (locationElement) {
            locationElement.textContent = event.location;
          } else {
            console.error('No element with id "event-location" found.');
          }

          // Inject the event title
          const titleElement = document.getElementById('event-title');
          if (titleElement) {
            titleElement.textContent = event.title;
          } else {
            console.error('No element with id "event-title" found.');
          }
  
          // Parse the datetime and inject date and time
          const datetimeElement = document.getElementById('event-datetime');
          if (datetimeElement) {
            const eventDate = new Date(event.datetime);
            const dateString = eventDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            const timeString = eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
            datetimeElement.textContent = `${dateString}, ${timeString}`;
          } else {
            console.error('No element with id "event-datetime" found.');
          }
        } else {
          console.warn('No events found in the JSON data.');
        }
      })
      .catch(error => console.error('Error loading events:', error));
  });
  