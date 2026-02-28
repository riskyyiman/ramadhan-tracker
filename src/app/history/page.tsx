'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, CalendarDays, BookOpen, Star, AlertCircle, ChevronRight, TrendingUp, History as HistoryIcon } from 'lucide-react';
import { type DailyHabits } from '@/hooks/useRamadhanData';

type HistoryRecord = {
  date: string;
  data: DailyHabits;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const records: HistoryRecord[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ramadhan_data_')) {
        const date = key.replace('ramadhan_data_', '');
        const rawData = localStorage.getItem(key);
        if (rawData) {
          records.push({ date, data: JSON.parse(rawData) });
        }
      }
    }
    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(records);
  }, []);

  const calculateScore = (data: DailyHabits) => {
    let score = 0;
    const total = 8;
    if (data.puasa) score++;
    if (data.tarawih) score++;
    if (data.sedekah) score++;
    Object.values(data.shalat).forEach((s) => {
      if (s) score++;
    });
    return Math.round((score / total) * 100);
  };

  const formatDateString = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background transition-colors duration-700">
      <main className="max-w-6xl mx-auto p-5 sm:p-6 lg:p-8 space-y-10 pt-8 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in duration-1000">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Riwayat <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-400 font-black">Mutaba'ah</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Tinjau kembali pencapaian spiritual harian Anda
            </p>
          </div>

          {history.length > 0 && (
            <div className="hidden md:flex items-center gap-4 bg-white/5 dark:bg-zinc-900/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Hari</p>
                <p className="text-2xl font-black text-foreground">{history.length}</p>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <TrendingUp className="text-emerald-500 w-8 h-8" />
            </div>
          )}
        </header>

        {/* --- content section --- */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 sm:p-24 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] shadow-sm animate-in zoom-in-95 duration-700 text-center">
            <div className="w-24 h-24 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-3xl flex items-center justify-center mb-8 rotate-12">
              <AlertCircle className="w-12 h-12 text-zinc-400 -rotate-12" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Belum Ada Lembaran Baru</h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">Mulai perjalanan spiritual Anda hari ini. Setiap langkah kecil dalam ibadah akan tercatat rapi di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {history.map((record, index) => {
              const score = calculateScore(record.data);
              const isExcellent = score >= 85;
              const isGood = score >= 60;

              return (
                <div
                  key={record.date}
                  className="group relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-7 rounded-4xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg text-foreground tracking-tight group-hover:text-emerald-500 transition-colors">{formatDateString(record.date)}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ramadhan 1447 H</p>
                    </div>
                    <div
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tighter border shadow-sm ${
                        isExcellent ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : isGood ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}
                    >
                      {score}% ACHIEVED
                    </div>
                  </div>

                  <div className="w-full bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full h-1.5 mb-8 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 delay-300 bg-linear-to-r ${isExcellent ? 'from-emerald-500 to-teal-400' : isGood ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-red-500'}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  {/* Checklist Summary */}
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${record.data.puasa ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-zinc-500/5 border-transparent opacity-60'}`}>
                        <span className="text-xs font-semibold text-foreground">Puasa</span>
                        {record.data.puasa ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-zinc-400" />}
                      </div>
                      <div className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${record.data.tarawih ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-zinc-500/5 border-transparent opacity-60'}`}>
                        <span className="text-xs font-semibold text-foreground">Tarawih</span>
                        {record.data.tarawih ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-zinc-400" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/10 shadow-inner group/tilawah">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover/tilawah:scale-110 transition-transform">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-foreground">Tilawah Quran</span>
                      </div>
                      <span className="text-sm font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-md">
                        {record.data.tilawah} <span className="text-[10px] font-medium text-muted-foreground ml-0.5">Hal</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
