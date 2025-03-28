
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("components/notifications/notification.json");
  const notifications = await response.json();
  const tableBody = document.querySelector(".notifications-table tbody");
  tableBody.innerHTML = ""; // clear template rows

  notifications.forEach(notification => {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    // Load and fill the notification card template
    fetch("components/notifications/notification_card.html")
      .then(res => res.text())
      .then(template => {
        template = template
          .replace("{{notification-title}}", notification.title)
          .replace("{{notification-message}}", notification.message)
          .replace("{{notification-date}}", notification.date);

        const wrapper = document.createElement("div");
        wrapper.innerHTML = template;
        wrapper.firstElementChild.onclick = () => {
          localStorage.setItem("selectedNotification", JSON.stringify(notification));
          window.location.href = "notifications_details.html";
        };

        cell.appendChild(wrapper.firstElementChild);
        row.appendChild(cell);
        tableBody.appendChild(row);
      });
  });
});
