'use client';

import { useEffect } from 'react';
import { useSettings } from './useSettings';

export function useDailyReminder() {
  const { settings, isLoaded } = useSettings();

  useEffect(() => {
    if (!isLoaded || !settings.notifications || !settings.reminderTime) return;

    // --- 1. REGISTRASI & SINKRONISASI SERVICE WORKER ---
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        // Kirim data terbaru ke SW setiap kali ada perubahan settings
        if (registration.active) {
          registration.active.postMessage({
            type: 'SYNC_REMINDER',
            reminderTime: settings.reminderTime,
            name: settings.name,
          });
        }
      });
    }

    // --- 2. LOGIKA FOREGROUND (DINAMIS JAM + TANGGAL) ---
    const checkTime = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      if (currentTime === settings.reminderTime) {
        const today = now.toDateString();

        // Kunci dinamis mencakup jam: memungkinkan notifikasi baru jika jam diubah
        const notificationKey = `notified_${settings.reminderTime}_${today}`;
        const hasBeenNotified = localStorage.getItem(notificationKey);

        if (!hasBeenNotified) {
          if (Notification.permission === 'granted') {
            new Notification("Waktunya Mutaba'ah! 🌙", {
              body: `Halo ${settings.name || 'Hamba Allah'}, saatnya mencatat ibadahmu hari ini.`,
              icon: '/favicon.ico',
            });

            localStorage.setItem(notificationKey, 'true');
          }
        }
      }
    };

    const interval = setInterval(checkTime, 60000);
    checkTime();

    return () => clearInterval(interval);
  }, [isLoaded, settings.notifications, settings.reminderTime, settings.name]);
}
