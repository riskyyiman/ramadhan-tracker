'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Bookmark, BookmarkCheck, Volume2, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { cn } from '@/lib/utils';

type Ayat = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
};

type SurahDetail = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  audioFull: Record<string, string>;
  ayat: Ayat[];
};

export default function DetailSurahPage() {
  const params = useParams();
  const router = useRouter();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRead, setLastRead] = useState<{ surah: number; ayat: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // memuat Data Surah & Bookmark
  useEffect(() => {
    // ambil data bookmark dari LocalStorage
    const saved = localStorage.getItem('last_read');
    if (saved) setLastRead(JSON.parse(saved));

    const fetchSurahDetail = async () => {
      try {
        const res = await fetch(`https://equran.id/api/v2/surat/${params.id}`);
        const data = await res.json();
        setSurah(data.data);
      } catch (error) {
        console.error('Gagal mengambil detail surah:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchSurahDetail();
  }, [params.id]);

  // LOGIKA AUTO-SCROLL KE BOOKMARK
  useEffect(() => {
    if (!loading && surah && lastRead && lastRead.surah === surah.nomor) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`ayat-${lastRead.ayat}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loading, surah, lastRead]);

  // simpan/hapus bookmark
  const toggleBookmark = (ayatNum: number) => {
    const newBookmark = { surah: surah?.nomor || 0, ayat: ayatNum };

    if (lastRead?.ayat === ayatNum && lastRead?.surah === surah?.nomor) {
      localStorage.removeItem('last_read');
      setLastRead(null);
    } else {
      localStorage.setItem('last_read', JSON.stringify(newBookmark));
      setLastRead(newBookmark);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-6 pt-6">
        {/* Tombol Kembali */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-[hsl(var(--primary))] transition-colors mb-4 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali ke Daftar Surah</span>
        </button>

        {loading || !surah ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-56 bg-[hsl(var(--card))] rounded-(--radius) border w-full"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-[hsl(var(--card))] rounded-(--radius) border w-full"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Header*/}
            <div className="bg-linear-to-br from-[hsl(var(--primary))] to-emerald-900 text-white p-8 md:p-12 rounded-(--radius) shadow-lg text-center relative overflow-hidden">
              <BookOpen className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
              <div className="relative z-10 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-2 font-arabic tracking-wider">{surah.nama}</h1>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight">{surah.namaLatin}</h2>
                  <p className="text-emerald-100/80 mt-2 font-medium">
                    {surah.arti} • {surah.jumlahAyat} Ayat • {surah.tempatTurun}
                  </p>
                </div>

                {lastRead?.surah === surah.nomor && (
                  <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-4 py-2 rounded-full text-amber-200 text-[10px] font-bold animate-pulse uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Otomatis dilanjutkan ke ayat {lastRead.ayat}
                  </div>
                )}

                {/* audio Player Component */}
                <div className="pt-2 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                    <Volume2 className="w-5 h-5 text-emerald-200" />
                    <audio src={surah.audioFull['05']} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} controls className="h-8 filter invert opacity-80" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Murottal: Misyari Rasyid Al-Afasy</p>
                </div>
              </div>
            </div>

            {/* List Ayat */}
            <div className="space-y-6 pt-4">
              {surah.ayat.map((ayat) => {
                const isBookmarked = lastRead?.surah === surah.nomor && lastRead?.ayat === ayat.nomorAyat;

                return (
                  <div
                    key={ayat.nomorAyat}
                    id={`ayat-${ayat.nomorAyat}`}
                    className={cn(
                      'bg-[hsl(var(--card))] p-6 md:p-8 rounded-(--radius) border transition-all duration-500 relative group',
                      isBookmarked ? 'border-amber-500 shadow-xl ring-2 ring-amber-500/10 scale-[1.01]' : 'shadow-sm hover:shadow-md',
                    )}
                  >
                    {/* badge Bookmark Terakhir */}
                    {isBookmarked && (
                      <div className="absolute -top-3 left-6 bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 tracking-wider">
                        <BookmarkCheck className="w-3.5 h-3.5" /> TERAKHIR DIBACA
                      </div>
                    )}

                    <div className="flex justify-between items-start gap-4 mb-8">
                      {/* Nomor Ayat & Toolbar */}
                      <div className="flex flex-col gap-3 shrink-0">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] font-bold border border-[hsl(var(--primary))]/20 shadow-inner">{ayat.nomorAyat}</div>
                        <button
                          onClick={() => toggleBookmark(ayat.nomorAyat)}
                          className={cn(
                            'p-2.5 rounded-full border transition-all active:scale-90',
                            isBookmarked ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-amber-500 hover:border-amber-500',
                          )}
                          title="Tandai bacaan terakhir"
                        >
                          <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                        </button>
                      </div>

                      {/* Teks Arab (Kanan) */}
                      <div className="flex-1 text-right">
                        <p className="text-3xl md:text-5xl font-arabic leading-14 md:leading-22 text-[hsl(var(--foreground))] selection:bg-emerald-100 dark:selection:bg-emerald-900/30" dir="rtl">
                          {ayat.teksArab}
                        </p>
                      </div>
                    </div>

                    {/* Terjemahan & Latin (Kiri) */}
                    <div className="space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                      <p className="text-[hsl(var(--primary))] text-sm md:text-base italic font-semibold leading-relaxed">{ayat.teksLatin}</p>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-loose">
                        <span className="font-bold text-[hsl(var(--foreground))] opacity-40 mr-2">{ayat.nomorAyat}.</span>
                        {ayat.teksIndonesia}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
