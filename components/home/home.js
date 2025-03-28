document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("components/event/events.json");
      const events = await response.json();
  
      const eventListContainer = document.querySelector("#event_list .row");
      eventListContainer.innerHTML = ""; // Clear default cards
  
      events.forEach(event => {
        fetch("components/home/event_card.html")
          .then(res => res.text())
          .then(template => {
            const filled = template
              .replace("{{event-title}}", event.title)
              .replace("{{event-timer}}", formatEventTime(event.datetime));
  
            const wrapper = document.createElement("article");
            wrapper.className = "event-card";
            wrapper.style.backgroundImage = `url('${event.image}')`;
            wrapper.style.backgroundSize = "cover";
            wrapper.style.backgroundPosition = "center";
            wrapper.style.backgroundRepeat = "no-repeat";
  
            wrapper.innerHTML = filled;
            eventListContainer.appendChild(wrapper);
          });
      });
    } catch (err) {
      console.error("Error loading events:", err);
    }
  });
  
  // Time formatter
  function formatEventTime(datetimeStr) {
    const now = new Date();
    const eventTime = new Date(datetimeStr);
    const diffMs = eventTime - now;
  
    if (diffMs <= 0) return "Event started";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    if (days >= 1) return `Starts in ${days} days`;
    if (days < 1) return `Starts in ${hours}h ${minutes}m ${seconds}s`;
}
  