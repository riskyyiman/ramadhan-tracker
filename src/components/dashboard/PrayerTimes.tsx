'use client';

import { useEffect, useState } from 'react';
import { Moon, MapPin, Loader2, RefreshCw } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

type PrayerTime = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export default function PrayerTimes() {
  const { settings } = useSettings();
  const [times, setTimes] = useState<PrayerTime | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeLeft: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayCity, setDisplayCity] = useState('Mencari Lokasi...');
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Jadwal Shalat berdasarkan Koordinat
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=11`);

      const text = await res.text();
      const cleanedJson = text.replace(/<[^>]*>?/gm, '').trim();
      const data = JSON.parse(cleanedJson);

      if (data.code === 200) {
        setTimes(data.data.timings);
      } else {
        throw new Error('Gagal mengambil data dari API');
      }

      // 2. Fetch Nama Kota (API BigDataCloud)
      const resCity = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`);
      const dataCity = await resCity.json();
      const cityName = dataCity.city || dataCity.locality || dataCity.principalSubdivision || 'Lokasi Terdeteksi';
      setDisplayCity(cityName);
    } catch (err) {
      console.error('Error:', err);
      setError('Gagal memuat jadwal');
      setDisplayCity(settings.city || 'Jakarta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchPrayerData(pos.coords.latitude, pos.coords.longitude),
        () => {
          // Jika GPS dimatikan, gunakan kota dari settings
          setDisplayCity(settings.city || 'Jakarta');
          // Contoh koordinat Jakarta sebagai fallback
          fetchPrayerData(-6.2088, 106.8456);
        },
      );
    }
  }, [settings.city]);

  // Logic Countdown
  useEffect(() => {
    if (!times) return;
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const timeToMins = (t: string) => t.split(':').map(Number)[0] * 60 + t.split(':').map(Number)[1];

      const list = [
        { n: 'Subuh', t: times.Fajr, m: timeToMins(times.Fajr) },
        { n: 'Dzuhur', t: times.Dhuhr, m: timeToMins(times.Dhuhr) },
        { n: 'Ashar', t: times.Asr, m: timeToMins(times.Asr) },
        { n: 'Maghrib', t: times.Maghrib, m: timeToMins(times.Maghrib) },
        { n: 'Isya', t: times.Isha, m: timeToMins(times.Isha) },
      ];

      let next = list.find((p) => p.m > currentTime) || list[0];
      let diff = next.m - currentTime;
      if (diff < 0) diff += 1440;

      setNextPrayer({
        name: next.n,
        time: next.t,
        timeLeft: `${Math.floor(diff / 60)}j ${diff % 60}m`,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [times]);

  const displayList = [
    { name: 'Subuh', key: 'Fajr' },
    { name: 'Dzuhur', key: 'Dhuhr' },
    { name: 'Ashar', key: 'Asr' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Isya', key: 'Isha' },
  ];

  return (
    <div className="bg-emerald-700 h-full dark:bg-emerald-900 bg-linear-to-br text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
      <Moon className="absolute -right-10 -top-10 w-48 h-48 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />

      <div className="relative z-10 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-medium opacity-90 truncate max-w-50">{displayCity}</span>
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
          </div>
          <h2 className="text-3xl font-bold mb-1 tracking-tight">Jadwal Shalat</h2>
          <p className="text-emerald-100 text-sm mb-6">Menuju {nextPrayer?.name || '...'}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black">{nextPrayer?.timeLeft || '--:--'}</span>
            <span className="text-lg font-medium opacity-80">lagi</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayList.map((item) => {
            const isActive = nextPrayer?.name === item.name;
            return (
              <div key={item.name} className={`p-3 rounded-xl border transition-all ${isActive ? 'bg-white text-emerald-800 border-white scale-105' : 'bg-emerald-800/50 border-emerald-600/50'}`}>
                <p className={`text-[10px] font-bold uppercase mb-1 ${isActive ? 'text-emerald-600' : 'text-emerald-300'}`}>{item.name}</p>
                <p className="text-lg font-bold">{times ? times[item.key as keyof PrayerTime] : '--:--'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
