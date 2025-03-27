window.addEventListener('DOMContentLoaded', function () {
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
  
          // Inject activity cards into the agenda content area
          fetch('./components/event/activity_card.html')
            .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load activity_card.html');
            }
            return response.text();
            })
            .then(template => {
                if(getUserId() == event.host_id){
                    renderActivityCards(template, event.activities, true);
                } else {
                    renderActivityCards(template, event.activities, false);
                }
            })
            .catch(error => console.error('Error loading activity template:', error));

            // Inject user data into the attendees overview
          fetch('./components/event/attendee_card.html')
          .then(response => {
          if (!response.ok) {
              throw new Error('Failed to load attendee_card.html');
          }
          return response.text();
          })
          .then(template => {
              if(getUserId() == event.host_id){
                    renderAttendeeCards(template, event.attendees, true);
              } else {
                    renderAttendeeCards(template, event.attendees, false);
              }
          })
          .catch(error => console.error('Error loading activity template:', error));
  
        } else {
          console.warn('No events found in the JSON data.');
        }
      })
      .catch(error => console.error('Error loading events:', error));
});
  

// Render activities by replacing placeholders in the template
function renderActivityCards(template, activities, host) {
    const container = document.getElementById('agenda_content');
    if (!container) {
        console.error('No container with id "agenda_content" found.');
        return;
    }

    activities.forEach(activity => {
        const article = document.createElement('article');
        article.classList.add('activity-card');
        if (host){
            let activityHTML = template
                .replace(/{{host}}/g, "host-logged-in")
                .replace(/{{activity-title}}/g, activity.activity_name)
                .replace(/{{start}}/g, formatTime(activity.start_time))
                .replace(/{{end}}/g, formatTime(activity.end_time));
                article.innerHTML += activityHTML;
        } else {
            let activityHTML = template
                .replace(/{{activity-title}}/g, activity.activity_name)
                .replace(/{{start}}/g, formatTime(activity.start_time))
                .replace(/{{end}}/g, formatTime(activity.end_time));
                article.innerHTML += activityHTML;
        }
        
        container.appendChild(article)
    });
}

// Render activities by replacing placeholders in the template
function renderAttendeeCards(template, attendees, host) {
    fetch('./db/db.json')
        .then(response => response.json())
        .then(usersData => {
            const users = usersData.users;

            // Get containers for different attendee statuses
            const categories = {
                "coming": document.querySelector("#coming + .person-list"),
                "pending": document.querySelector("#pending + .person-list"),
                "maybe": document.querySelector("#maybe + .person-list"),
                "cant": document.querySelector("#cant + .person-list"),
            };

            // Clear existing attendees
            Object.values(categories).forEach(category => {
                if (category) category.innerHTML = "";
            });

            // Loop through event attendees and find matching user details
            attendees.forEach(attendee => {
                const user = users.find(u => u.id === attendee.user_id);
                if (!user) return;

                // Create attendee card HTML
                let attendeeHTML = template
                    .replace(/{{user_name}}/g, user.username);

                // Insert into the correct category (if it exists)
                if (categories[attendee.status]) {
                    categories[attendee.status].innerHTML += attendeeHTML;
                }
            });
        })
        .catch(error => console.error("Error fetching users:", error));

}

/*
// Function to render activity cards using the activities array from the event JSON
function renderActivityCards(activities) {
  // Find the container in agenda.html where the activity cards are injected
  const container = document.getElementById('agenda_content');
  if (!container) {
    console.error('No container with id "agenda_content" found.');
    return;
  }
  
  // Optionally clear any existing static content
  container.innerHTML = '';
  
  activities.forEach((activity, index) => {
    // Create an article element for each activity
    const article = document.createElement('article');
    article.id = `activity-card-${index + 1}`;
    article.classList.add('activity-card');
    
    // Set the data attributes for the xlu-include template
    //article.setAttribute('data-host', '{{host}}');  // placeholder maintained if host is injected elsewhere
    article.setAttribute('data-activity-title', activity.activity_name);
    article.setAttribute('data-start', formatTime(activity.start_time));
    article.setAttribute('data-end', formatTime(activity.end_time));
    article.setAttribute('style',"display: flex; flex-direction: column; padding: 1.5rem;");
    
    // Specify the include file for the activity card template
    article.setAttribute('xlu-include-file', "components/event/activity_card.html");
    
    // Append the article to the agenda container
    container.appendChild(article);
  });
} */
  
// Helper function to format time
function formatTime(timeValue) {
  const hour = Math.floor(timeValue);
  let minutes = Math.round((timeValue - hour) * 60);
  
  // Convert to 12-hour format and determine AM/PM
  let period = 'AM';
  let displayHour = hour;
  if (hour >= 12) {
    period = 'PM';
    if (hour > 12) {
      displayHour = hour - 12;
    }
  }
  if (displayHour === 0) {
    displayHour = 12;
  }
  
  // Ensure minutes are two digits
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${displayHour}:${minutes} ${period}`;
}