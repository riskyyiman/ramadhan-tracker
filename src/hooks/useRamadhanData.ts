'use client';

import { useEffect, useState } from 'react';

export type DailyHabits = {
  puasa: boolean;
  shalat: { subuh: boolean; dzuhur: boolean; ashar: boolean; maghrib: boolean; isya: boolean };
  tarawih: boolean;
  tilawah: number;
  sedekah: boolean;
};

const defaultHabits: DailyHabits = {
  puasa: false,
  shalat: { subuh: false, dzuhur: false, ashar: false, maghrib: false, isya: false },
  tarawih: false,
  tilawah: 0,
  sedekah: false,
};

export function useRamadhanData() {
  const [habits, setHabits] = useState<DailyHabits>(defaultHabits);
  const [isLoaded, setIsloaded] = useState(false);

  // Load data dari localstroage  saat komponen pertama kali di-render
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const savedData = localStorage.getItem(`ramadhan_data_${today}`);
    if (savedData) {
      setHabits(JSON.parse(savedData));
    }
    setIsloaded(true);
  }, []);

  // Simpan ke localstorage setiap ada perubahan
  useEffect(() => {
    if (isLoaded) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`ramadhan_data_${today}`, JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  const updateHabit = (key: keyof DailyHabits, value: any) => {
    setHabits((prev) => ({ ...prev, [key]: value }));
  };

  const updateShalat = (waktu: keyof DailyHabits['shalat'], value: boolean) => {
    setHabits((prev) => ({
      ...prev,
      shalat: { ...prev.shalat, [waktu]: value },
    }));
  };
  return { habits, updateHabit, updateShalat, isLoaded };
}
