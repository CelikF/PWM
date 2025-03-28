document.addEventListener("DOMContentLoaded", () => {
  const notification = JSON.parse(localStorage.getItem("selectedNotification"));

  fetch("components/notifications/notification_detail_card.html")
    .then(res => res.text())
    .then(template => {
      const filled = template
        .replace("{{notification-title}}", notification.title)
        .replace("{{sender-name}}", notification.senderName)
        .replace("{{sender-email}}", notification.senderEmail)
        .replace("{{notification-time}}", `${notification.date} - ${notification.time}`)
        .replace("{{notification-message}}", notification.message);

      document.querySelector(".notification-content").innerHTML = filled;
    });
});
