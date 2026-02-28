'use client';

import { useRamadhanData } from '../../hooks/useRamadhanData';
import { CheckCircle2, Circle, Book, Coins, Minus, Plus, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HabitTracker() {
  const { habits, updateHabit, updateShalat, isLoaded } = useRamadhanData();

  if (!isLoaded) return <div className="h-64 animate-pulse bg-[hsl(var(--card))] rounded-(--radius) border" />;

  const shalatKeys = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'] as const;

  // Menghitung Persentase Harian untuk Progress Bar
  const calculateProgress = () => {
    let completed = 0;
    let total = 8;

    if (habits.puasa) completed++;
    if (habits.tarawih) completed++;
    if (habits.sedekah) completed++;
    shalatKeys.forEach((k) => {
      if (habits.shalat[k]) completed++;
    });

    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="bg-[hsl(var(--card))] rounded-(--radius) shadow-sm border overflow-hidden">
      {/* Header & Progress Bar */}
      <div className="p-6 pb-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-[hsl(var(--primary))]" />
            Mutaba'ah Yaumiyah
          </h2>
          <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400">{progress}% Selesai</span>
        </div>
        {/* Progress Bar Visual */}
        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-[hsl(var(--primary))] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-6 space-y-6 pt-4">
        {/* Section 1: Puasa & Tarawih (Kartu Besar) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'puasa', label: 'Puasa Ramadhan' },
            { key: 'tarawih', label: 'Shalat Tarawih' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => updateHabit(key as 'puasa' | 'tarawih', !habits[key as 'puasa' | 'tarawih'])}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.98]',
                habits[key as 'puasa' | 'tarawih'] ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-500/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900',
              )}
            >
              <span className="font-semibold text-sm md:text-base">{label}</span>
              {habits[key as 'puasa' | 'tarawih'] ? <CheckCircle2 className="text-emerald-600 dark:text-emerald-500 animate-in zoom-in spin-in-45 duration-300" /> : <Circle className="text-zinc-300" />}
            </button>
          ))}
        </div>

        {/* Section 2: Shalat 5 Waktu (Grid Compact) */}
        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xs font-bold text-zinc-500 mb-3 uppercase tracking-wider flex items-center gap-2">Shalat Wajib</h3>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {shalatKeys.map((waktu) => (
              <button
                key={waktu}
                onClick={() => updateShalat(waktu, !habits.shalat[waktu])}
                className={cn(
                  'flex flex-col items-center justify-center py-3 px-1 rounded-xl border transition-all active:scale-95',
                  habits.shalat[waktu]
                    ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-black hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-500',
                )}
              >
                <span className="text-[10px] md:text-xs font-medium capitalize mb-1 md:mb-2">{waktu}</span>
                {habits.shalat[waktu] ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Circle className="w-5 h-5 md:w-6 md:h-6 opacity-50" />}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Tilawah (Stepper) & Sedekah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stepper Tilawah */}
          <div className="flex items-center justify-between p-4 rounded-xl border bg-white dark:bg-black">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[hsl(var(--accent))]/10 rounded-lg">
                <Book className="text-[hsl(var(--accent))] w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Tilawah</span>
                <span className="text-[10px] text-zinc-500">Halaman</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
              <button onClick={() => updateHabit('tilawah', Math.max(0, (habits.tilawah || 0) - 1))} className="p-2 hover:bg-white dark:hover:bg-black rounded-md transition-colors text-zinc-500 hover:text-red-500">
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono font-bold w-6 text-center">{habits.tilawah || 0}</span>
              <button onClick={() => updateHabit('tilawah', (habits.tilawah || 0) + 1)} className="p-2 hover:bg-white dark:hover:bg-black rounded-md transition-colors text-zinc-500 hover:text-emerald-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sedekah Button */}
          <button
            onClick={() => updateHabit('sedekah', !habits.sedekah)}
            className={cn(
              'flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.98]',
              habits.sedekah ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 ring-1 ring-amber-500/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900 bg-white dark:bg-black',
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', habits.sedekah ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-amber-50 dark:bg-amber-900/10')}>
                <Coins className={cn('w-5 h-5', habits.sedekah ? 'text-amber-600' : 'text-amber-500/70')} />
              </div>
              <span className="font-semibold text-sm">Sedekah</span>
            </div>
            {habits.sedekah ? <CheckCircle2 className="text-amber-500 animate-in zoom-in" /> : <Circle className="text-zinc-300" />}
          </button>
        </div>
      </div>
    </div>
  );
}
