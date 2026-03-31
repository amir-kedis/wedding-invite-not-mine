// Push notification service worker
self.addEventListener("push", (event) => {
  let data = { title: "New RSVP Response!", body: "Someone responded to your wedding invitation." };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.warn("Failed to parse push data:", e);
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      vibrate: [200, 100, 200],
      tag: "rsvp-notification",
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/guests") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/guests");
      }
    })
  );
});
