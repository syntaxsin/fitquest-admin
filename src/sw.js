//FCM Service Worker

self.addEventListener("push", (e) => {
    const notif = e.data.json().notification;

    e.waitnUntil(self.registration.showNotification(notif.title, {
        body: notif.body,
        icon: notif.image,
        data: {
            url: notif.click_action
        }
    }));

});

self.addEventListener("notificationclick", (e) => {
    e.waitnUntil((client.openWindow(e.notification.data.url)));
});