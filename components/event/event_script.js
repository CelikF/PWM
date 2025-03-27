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

          // Render host tools
          if(getUserId() == event.host_id){
            renderHostToolbar("./event_details.html");
          }
  
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
                    renderAttendeeCards(template, event.attendees);
              } else {
                    renderAttendeeCards(template, event.attendees);
              }
          })
          .catch(error => console.error('Error loading activity template:', error));

          // Inject news card into the news overview
          fetch('./components/event/news_card.html')
          .then(response => {
          if (!response.ok) {
              throw new Error('Failed to load news_card.html');
          }
          return response.text();
          })
          .then(template => {
              if(getUserId() == event.host_id){
                    renderNewsCards(template, event.news);
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

function renderHostToolbar(path){
    fetch(path).then(response => {return response.text();})
    .then(template => {

         // Find the container element where the HTML should be inserted
         const desc_container = document.getElementById("description"); // Replace with the correct element ID
         if (desc_container) {
            desc_container.innerHTML = desc_container.innerHTML.replace(/{{host}}/g, "host-logged-in");// = updatedTemplate;  // Insert the updated template into the container
         }

         const agenda_container = document.getElementById("agenda"); // Replace with the correct element ID
         if (agenda_container) {
            agenda_container.innerHTML = agenda_container.innerHTML.replace(/{{host}}/g, "host-logged-in");// = updatedTemplate;  // Insert the updated template into the container
         }

         const attendee_container = document.getElementById("attendee"); // Replace with the correct element ID
         if (attendee_container) {
            attendee_container.innerHTML = attendee_container.innerHTML.replace(/{{host}}/g, "host-logged-in");// = updatedTemplate;  // Insert the updated template into the container
         }
         const user_invitation = document.getElementById("user_invitation");
         fetch("./components/event/manage_attendees.html").then(response => {return response.text();})
         .then(manage_invites_html => {
            user_invitation.innerHTML = manage_invites_html.replace(/{{host}}/g, "host-logged-in");
        })

         const news_container = document.getElementById("news"); // Replace with the correct element ID
         if (news_container) {
            news_container.innerHTML = news_container.innerHTML.replace(/{{host}}/g, "host-logged-in");// = updatedTemplate;  // Insert the updated template into the container
         }
     })
     .catch(error => console.error('Error fetching template:', error));  // Handle errors
}

// Render attendees by replacing placeholders in the template
function renderAttendeeCards(template, attendees) {
    fetch('./db/db.json')
        .then(response => response.json())
        .then(data => {
            const users = data.users;

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

function renderNewsCards(template, news) {
    const container = document.getElementById('news_content');
    if (!container) {
        console.error('No container with id "news_content" found.');
        return;
    }
    console.log(news)

    news.forEach(newscard => {
        const article = document.createElement('article');
        article.classList.add('news-card');
        if (false){
            let newsHTML = template
                .replace(/{{host}}/g, "host-logged-in")
                .replace(/{{news-title}}/g, newscard.title)
                .replace(/{{news-description}}/g, newscard.description);
                article.innerHTML += newsHTML;
        } else {
            let newsHTML = template
                .replace(/{{news-title}}/g, newscard.title)
                .replace(/{{news-description}}/g, newscard.description);
            article.innerHTML += newsHTML;
        }
        
        container.appendChild(article)
        xLuIncludeFile();
    });
}


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