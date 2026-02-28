// public/sw.js

let reminderConfig = {
  reminderTime: '',
  name: '',
};

// Menerima update data dari aplikasi utama secara dinamis
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_REMINDER') {
    reminderConfig = {
      reminderTime: event.data.reminderTime,
      name: event.data.name,
    };
    console.log('SW: Data Pengingat Disinkronkan', reminderConfig.reminderTime);
  }
});

// Pengecekan waktu di latar belakang
setInterval(() => {
  if (!reminderConfig.reminderTime) return;

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (currentTime === reminderConfig.reminderTime) {
    const today = now.toDateString();
    const notificationKey = `notified_${reminderConfig.reminderTime}_${today}`;

    // Gunakan cache untuk mengecek apakah sudah dikirim hari ini pada jam ini
    caches.open('reminder-status').then((cache) => {
      cache.match(notificationKey).then((response) => {
        if (!response) {
          self.registration.showNotification("Waktunya Mutaba'ah! 🌙", {
            body: `Halo ${reminderConfig.name || 'Hamba Allah'}, saatnya mencatat ibadahmu hari ini.`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'daily-reminder',
            renotify: true,
          });

          // Tandai sudah terkirim
          cache.put(notificationKey, new Response('true'));
        }
      });
    });
  }
}, 60000);
