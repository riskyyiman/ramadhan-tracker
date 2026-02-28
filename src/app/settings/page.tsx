'use client';

import { useState, useEffect } from 'react';
import { User, MapPin, Save, Bell, CheckCircle2, Crosshair, Info, Settings as SettingsIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsPage() {
  const { settings, updateSettings, isLoaded } = useSettings();
  const [localName, setLocalName] = useState('');
  const [localCity, setLocalCity] = useState('');

  const [localReminderTime, setLocalReminderTime] = useState(settings.reminderTime || '20:30');

  const [isSaved, setIsSaved] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Sync state lokal dengan setting global saat pertama kali load
  useEffect(() => {
    if (isLoaded) {
      setLocalName(settings.name || '');
      setLocalCity(settings.city || 'Jakarta');

      setLocalReminderTime(settings.reminderTime || '20:30');
    }
  }, [isLoaded, settings]);

  const handleSave = () => {
    updateSettings({ name: localName, city: localCity, reminderTime: localReminderTime });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Fungsi Deteksi Lokasi Otomatis
  const handleAutoLocation = () => {
    setGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || 'Jakarta';
            const cleanCity = city.replace(/(Kabupaten|Kota)\s+/gi, '');
            setLocalCity(cleanCity);
          } catch (error) {
            console.error('Gagal reverse geocode:', error);
            alert('Gagal mengambil nama kota. Silakan masukkan secara manual.');
          } finally {
            setGettingLocation(false);
          }
        },
        () => {
          alert('Akses lokasi ditolak. Silakan izinkan akses lokasi di browser Anda.');
          setGettingLocation(false);
        },
      );
    } else {
      alert('Browser Anda tidak mendukung deteksi lokasi.');
      setGettingLocation(false);
    }
  };

  const handleNotificationToggle = async () => {
    const newVal = !settings.notifications;
    if (newVal) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateSettings({ notifications: true });
        new Notification('Ramadhan Tracker', { body: 'Notifikasi berhasil diaktifkan!' });
      } else {
        alert('Izin notifikasi ditolak oleh browser.');
      }
    } else {
      updateSettings({ notifications: false });
    }
  };

  if (!isLoaded)
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-900/10 via-[hsl(var(--background))] to-[hsl(var(--background))] transition-colors duration-500 md:pb-12">
      <main className="max-w-3xl mx-auto p-4 sm:p-6 md:p-8 space-y-8 pt-6">
        {/* --- HEADER SECTION --- */}
        <header className="flex items-center gap-4 sm:gap-5 mb-8 animate-fade-in">
          <div className="p-4 bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-2xl shadow-inner border border-emerald-200 dark:border-emerald-800/50 shrink-0">
            <SettingsIcon className="text-emerald-600 dark:text-emerald-400 w-8 h-8 drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Pengaturan</h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Sesuaikan preferensi aplikasi Anda.</p>
          </div>
        </header>

        <div className="space-y-6 animate-fade-in-up">
          <section className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800/60 shadow-sm overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center gap-2.5">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-lg text-[hsl(var(--foreground))]">Personalisasi</h2>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Input Nama */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Nama Panggilan</label>
                <div className="relative group/input">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within/input:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Masukkan nama Anda (misal: Ahmad)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Input Lokasi */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Lokasi Jadwal Shalat</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 group/input">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within/input:text-emerald-500 transition-colors" />
                    <input
                      type="text"
                      value={localCity}
                      onChange={(e) => setLocalCity(e.target.value)}
                      placeholder="Misal: Banyumas, Purwokerto"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm text-sm sm:text-base"
                    />
                  </div>
                  <button
                    onClick={handleAutoLocation}
                    disabled={gettingLocation}
                    className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-5 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 whitespace-nowrap border border-emerald-200 dark:border-emerald-800/50"
                  >
                    <Crosshair className={cn('w-5 h-5', gettingLocation && 'animate-spin')} />
                    {gettingLocation ? 'Mencari...' : 'Cari Otomatis'}
                  </button>
                </div>

                {/* Info Tips Lokasi */}
                <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4 rounded-xl mt-3 flex gap-3 items-start backdrop-blur-sm">
                  <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400/90 leading-relaxed">
                    <strong>Tips:</strong> Jika hasil cari otomatis memunculkan nama desa spesifik dan jadwal <em>error</em>, ubah manual menjadi nama <strong>Kota/Kabupaten</strong> terdekat.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 2: PREFERENSI & PENGINGAT --- */}
          <section className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-zinc-800/60 shadow-sm overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-bold text-lg text-[hsl(var(--foreground))]">Preferensi Pengingat</h2>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Notifikasi Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[hsl(var(--foreground))]">Izinkan Notifikasi</h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">Dapatkan pengingat waktu shalat & ibadah harian.</p>
                </div>
                <button
                  onClick={handleNotificationToggle}
                  className={cn('w-14 h-7 rounded-full transition-colors relative shrink-0 border-2', settings.notifications ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700 border-transparent')}
                >
                  <div className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300', settings.notifications ? 'translate-x-7' : 'translate-x-0')} />
                </button>
              </div>

              <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/80" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-sm sm:text-base text-[hsl(var(--foreground))]">Waktu Pengingat Tracker</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">Kapan Anda ingin diingatkan untuk mencatat mutaba'ah harian?</p>
                </div>

                <div className="relative shrink-0">
                  <input
                    type="time"
                    value={localReminderTime}
                    onChange={(e) => setLocalReminderTime(e.target.value)}
                    disabled={!settings.notifications}
                    className={cn(
                      'pl-4 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 outline-none transition-all shadow-sm font-bold text-lg sm:text-xl',
                      settings.notifications
                        ? 'focus:bg-white dark:focus:bg-zinc-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-emerald-700 dark:text-emerald-400 cursor-pointer'
                        : 'opacity-50 cursor-not-allowed text-zinc-400 dark:text-zinc-500',
                    )}
                  />
                </div>
              </div>

              {/* Mini Info untuk Waktu Pengingat */}
              <div className="flex items-start gap-2.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                <Info className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Sangat disarankan untuk mengatur waktu di malam hari setelah shalat Tarawih (misal: <strong>20:30</strong> atau <strong>21:00</strong>) agar semua aktivitas ibadah pada hari tersebut sudah selesai dilakukan.
                </span>
              </div>
            </div>
          </section>

          {/* --- ACTION BUTTONS --- */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-4">
            {isSaved && (
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-right-4 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4.5 h-4.5" /> Berhasil Disimpan
              </span>
            )}
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save className="w-5 h-5" /> Simpan Perubahan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
