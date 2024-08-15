import consumer from "./consumer";

const notificationChannel = consumer.subscriptions.create("NotificationChannel", {
  received(data) {
    handleReceive();
  },
});

function handleReceive() {
  const notificationElement = document.getElementById("notification");
  if (notificationElement) {
    notificationElement.classList.remove("hidden");
  }
}

export default notificationChannel;
