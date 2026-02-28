'use client';

import { useState, useEffect } from 'react';
import PrayerTimes from '@/components/dashboard/PrayerTimes';
import HabitTracker from '@/components/dashboard/HabitTracer';
import { Trophy, Calendar as CalendarIcon, Sparkles, Star, MoonStar, Quote, Activity } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export default function Home() {
  const { settings, isLoaded } = useSettings();
  const [ramadanDay, setRamadanDay] = useState<number>(0);
  const [greeting, setGreeting] = useState<string>('Selamat Datang');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);

  const [dailyDua, setDailyDua] = useState({ judul: '', arab: '', arti: '' });
  const [eidDays, setEidDays] = useState(0);

  useEffect(() => {
    setIsMounted(true);

    const RAMADAN_START_DATE = new Date('2026-02-18T00:00:00');
    const today = new Date();
    const diffTime = today.getTime() - RAMADAN_START_DATE.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const currentDay = diffDays < 1 ? 0 : diffDays > 30 ? 30 : diffDays;
    setRamadanDay(currentDay);

    const hour = today.getHours();
    if (hour < 11) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString('id-ID', options));

    const duaList = [
      { judul: 'Doa Berbuka Puasa', arab: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ', arti: 'Telah hilang rasa haus dan urat-urat telah basah, dan telah ditetapkan pahala, insya Allah.' },
      {
        judul: 'Kebaikan Dunia Akhirat',
        arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        arti: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan akhirat, dan peliharalah kami dari siksa neraka.',
      },
      { judul: 'Memohon Berkah Ramadhan', arab: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَمَضَانَ', arti: 'Ya Allah, berkahilah kami di bulan Ramadhan ini.' },
    ];
    setDailyDua(duaList[today.getDate() % duaList.length]);

    const EID_DATE = new Date('2026-03-20T00:00:00');
    const eidDiff = EID_DATE.getTime() - today.getTime();
    setEidDays(Math.max(0, Math.ceil(eidDiff / (1000 * 60 * 60 * 24))));
  }, []);

  const progressPercentage = (ramadanDay / 30) * 100;

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background transition-colors duration-700">
      <main className="max-w-6xl mx-auto p-5 sm:p-6 lg:p-8 space-y-8 pt-8">
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 animate-in fade-in duration-1000">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider border border-emerald-500/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>RAMADHAN 1447 H</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-400">{isLoaded && settings?.name ? settings.name : 'Hamba Allah'}</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <CalendarIcon className="w-4 h-4 opacity-70" />
              {currentDate || 'Memuat tanggal...'}
            </p>
          </div>
        </header>

        {/* --- TOP GRID: PRAYER & PROGRESS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Shalat (Glass Style) */}
          <div className="lg:col-span-2 rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm">
            <PrayerTimes />
          </div>

          {/* Card Progress */}
          <div className="relative p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md flex flex-col justify-center items-center text-center group">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20 shadow-inner">
              <Trophy className="text-amber-500 w-10 h-10" />
            </div>
            <h3 className="font-bold text-3xl text-foreground leading-tight">{ramadanDay > 0 ? `Hari Ke-${ramadanDay}` : 'Segera Mulai'}</h3>
            <p className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-widest">Ramadhan Tracker</p>

            <div className="w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full h-2.5 mt-8 overflow-hidden">
              <div className="bg-linear-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${progressPercentage}%` }} />
            </div>
            <div className="flex justify-between w-full mt-3 px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
              <span>Day 1</span>
              <span className="text-emerald-500">{Math.round(progressPercentage)}% Selesai</span>
              <span>Day 30</span>
            </div>
          </div>
        </div>

        {/* --- BOTTOM GRID: DOA & EID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-8 rounded-3xl border border-emerald-500/10 shadow-sm relative overflow-hidden group">
            <Quote className="absolute right-6 top-6 w-16 h-16 text-emerald-500/5 rotate-12" />

            <div className="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
              <Star className="w-3.5 h-3.5 fill-current" /> {dailyDua.judul || 'Daily Inspiration'}
            </div>

            <div className="space-y-6">
              <p className="font-arabic text-3xl md:text-4xl text-right leading-relaxed text-foreground">{dailyDua.arab}</p>
              <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed pl-4 border-l-2 border-emerald-500/20">"{dailyDua.arti}"</p>
            </div>
          </div>

          {/* Eid Card  */}
          <div className="bg-linear-to-br from-amber-600/90 to-orange-700/90 p-8 rounded-3xl text-white shadow-lg flex flex-col items-center justify-center relative overflow-hidden group border border-white/10">
            <MoonStar className="absolute -left-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-[-10deg] transition-transform duration-700" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 opacity-80">Counting Down</p>
            <h3 className="text-2xl font-black tracking-tight mb-8">Idul Fitri 1447 H</h3>

            <div className="bg-white/10 backdrop-blur-md px-10 py-6 rounded-2xl border border-white/20 text-center w-full">
              <span className="text-6xl font-black block leading-none">{eidDays}</span>
              <p className="text-[10px] font-bold mt-2 tracking-[0.2em] uppercase opacity-90">Hari Lagi</p>
            </div>
          </div>
        </div>

        {/* --- MAIN TRACKER --- */}
        <div className="pt-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Mutaba'ah Harian</h2>
          </div>
          <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 shadow-sm">
            <HabitTracker />
          </div>
        </div>
      </main>
    </div>
  );
}
