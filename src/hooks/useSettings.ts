'use client';

import { useState, useEffect, useCallback } from 'react';

type Settings = {
  reminderTime: string;
  name: string;
  city: string;
  darkMode: boolean;
  notifications: boolean;
};

const defaultSettings: Settings = {
  name: 'Hamba Allah',
  city: 'Jakarta',
  darkMode: true,
  notifications: true,
  reminderTime: '20:30',
};

const STORAGE_KEY = 'app_settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Memuat data dari localStorage saat aplikasi pertama kali dijalankan
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);

        if (parsed.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.error('Gagal memuat pengaturan dari localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Fungsi untuk memperbarui pengaturan dan menyimpannya secara permanen
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };

      // Simpan ke localStorage agar tidak hilang saat browser ditutup
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Gagal menyimpan pengaturan ke localStorage:', error);
      }

      // Terapkan perubahan Dark Mode ke elemen HTML secara real-time
      if (newSettings.darkMode !== undefined) {
        if (newSettings.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      return updated;
    });
  }, []);

  return { settings, updateSettings, isLoaded };
}
