'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Search, MapPin, Sparkles, Book, ChevronRight, Hash, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

type Surah = {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
};

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://equran.id/api/v2/surat');
        const data = await res.json();
        setSurahs(data.data);
      } catch (error) {
        console.error('Gagal mengambil data surah:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((s) => s.namaLatin.toLowerCase().includes(search.toLowerCase()) || s.arti.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background transition-colors duration-700">
      <main className="max-w-6xl mx-auto p-5 sm:p-6 lg:p-8 space-y-10 pt-8 pb-24">
        {/* ---HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in duration-1000">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Al-Qur'an <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-400 font-black">Digital</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Book className="w-4 h-4 opacity-70" />
              114 Surah • 30 Juz • Baca kapan pun, di mana pun
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari nama surah atau arti..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm font-medium"
            />
          </div>
        </header>

        {/* --- LIST SURAH GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-28 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-sm rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {filteredSurahs.map((surah, index) => (
              <Link
                href={`/quran/${surah.nomor}`}
                key={surah.nomor}
                className="group relative flex items-center gap-4 p-5 rounded-4xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${(index % 12) * 50}ms` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Bagian Kiri: Nomor Surah*/}
                <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rotate-45 rounded-xl border border-emerald-500/20 group-hover:rotate-90 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-500 shadow-sm"></div>
                  <span className="relative z-10 text-sm font-black text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors">{surah.nomor}</span>
                </div>

                {/* Bagian Tengah: Info Surah */}
                <div className="flex-1 min-w-0 z-10">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-emerald-500 transition-colors truncate">{surah.namaLatin}</h3>
                  <p className="text-[11px] text-muted-foreground italic truncate mb-2">"{surah.arti}"</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">
                      <MapPin className="w-3 h-3 text-emerald-500" /> {surah.tempatTurun}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">{surah.jumlahAyat} Ayat</span>
                  </div>
                </div>

                {/* Bagian Kanan: Teks Arab */}
                <div className="text-3xl font-arabic text-emerald-600 dark:text-emerald-500 pr-2 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm origin-right" dir="rtl">
                  {surah.nama}
                </div>
              </Link>
            ))}

            {/* Empty Search Result */}
            {filteredSurahs.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-dashed border-zinc-300 dark:border-zinc-800 text-center px-6">
                <div className="w-20 h-20 bg-emerald-500/5 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Surah Tidak Ditemukan</h3>
                <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                  Kami tidak menemukan hasil untuk <span className="text-emerald-500 font-semibold">"{search}"</span>. Pastikan ejaan atau kata kunci sudah benar.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
