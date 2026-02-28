'use client';

import { useState } from 'react';
import { Heart, Search, Sparkles, Copy, Check, Quote, Book, BookOpen, Library } from 'lucide-react';

const HADITS_DATA = [
  {
    id: 1,
    tema: 'Ampunan',
    arab: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    indo: 'Barangsiapa yang berpuasa Ramadhan karena iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.',
    perawi: 'HR. Bukhari no. 38 & Muslim no. 760',
  },
  {
    id: 2,
    tema: 'Tarawih',
    arab: 'مَنْ قَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    indo: 'Barangsiapa yang shalat malam di bulan Ramadhan (Tarawih) karena iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.',
    perawi: 'HR. Bukhari no. 37 & Muslim no. 759',
  },
  {
    id: 3,
    tema: 'Berkah Sahur',
    arab: 'تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً',
    indo: 'Makan sahurlah kalian, karena sesungguhnya di dalam sahur itu terdapat berkah.',
    perawi: 'HR. Bukhari no. 1923 & Muslim no. 1095',
  },
  {
    id: 4,
    tema: 'Menyegerakan Berbuka',
    arab: 'لاَ يَزَالُ النَّاسُ بِخَيْرٍ مَا عَجَّلُوا الْفِطْرَ',
    indo: 'Manusia akan senantiasa berada dalam kebaikan selama mereka menyegerakan berbuka puasa.',
    perawi: 'HR. Bukhari no. 1957 & Muslim no. 1098',
  },
  {
    id: 5,
    tema: 'Pintu Surga Ar-Rayyan',
    arab: 'إِنَّ فِي الْجَنَّةِ بَابًا يُقَالُ لَهُ الرَّيَّانُ يَدْخُلُ مِنْهُ الصَّائِمُونَ يَوْمَ الْقِيَامَةِ لاَ يَدْخُلُ مِنْهُ أَحَدٌ غَيْرُهُمْ',
    indo: 'Sesungguhnya di surga ada sebuah pintu yang bernama Ar-Rayyan. Pada hari kiamat, orang-orang yang berpuasa akan masuk melaluinya, tidak ada seorang pun selain mereka yang masuk.',
    perawi: 'HR. Bukhari no. 1896 & Muslim no. 1152',
  },
  {
    id: 6,
    tema: 'Kedermawanan',
    arab: 'كَانَ رَسُولُ اللَّهِ صلى الله عليه وسلم أَجْوَدَ النَّاسِ، وَكَانَ أَجْوَدَ مَا يَكُونُ فِي رَمَضَانَ',
    indo: 'Rasulullah SAW adalah manusia yang paling dermawan, dan beliau jauh lebih dermawan lagi di bulan Ramadhan.',
    perawi: 'HR. Bukhari no. 6',
  },
  {
    id: 7,
    tema: 'Lailatul Qadar',
    arab: 'تَحَرَّوْا لَيْلَةَ الْقَدْرِ فِي الْوِتْرِ مِنَ الْعَشْرِ الأَوَاخِرِ مِنْ رَمَضَانَ',
    indo: 'Carilah Lailatul Qadar pada malam ganjil di sepuluh malam terakhir bulan Ramadhan.',
    perawi: 'HR. Bukhari no. 2017',
  },
  {
    id: 8,
    tema: 'Keistimewaan Puasa',
    arab: 'لَخُلُوفُ فَمِ الصَّائِمِ أَطْيَبُ عِنْدَ اللَّهِ مِنْ رِيحِ الْمِسْكِ',
    indo: 'Sungguh, bau mulut orang yang berpuasa lebih harum di sisi Allah daripada aroma minyak kasturi.',
    perawi: 'HR. Bukhari no. 1894 & Muslim no. 1151',
  },
  {
    id: 9,
    tema: 'Kebahagiaan Puasa',
    arab: 'لِلصَّائِمِ فَرْحَتَانِ يَفْرَحُهُمَا إِذَا أَفْطَرَ فَرِحَ وَإِذَا لَقِيَ رَبَّهُ فَرِحَ بِصَوْمِهِ',
    indo: 'Bagi orang yang berpuasa akan mendapatkan dua kebahagiaan: kebahagiaan ketika dia berbuka dan kebahagiaan ketika berjumpa dengan Rabbnya dengan membawa pahala puasanya.',
    perawi: 'HR. Bukhari no. 1904 & Muslim no. 1151',
  },
  {
    id: 10,
    tema: 'Menjaga Lisan',
    arab: 'مَنْ لَمْ يَدَعْ قَوْلَ الزُّورِ وَالْعَمَلَ بِهِ فَلَيْسَ لِلَّهِ حَاجَةٌ فِي أَنْ يَدَعَ طَعَامَهُ وَشَرَابَهُ',
    indo: 'Barangsiapa yang tidak meninggalkan perkataan dusta malah mengamalkannya, maka Allah tidak butuh dari rasa lapar dan haus yang ia tahan.',
    perawi: 'HR. Bukhari no. 1903',
  },
];

export default function HaditsPage() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredHadits = HADITS_DATA.filter((h) => h.tema.toLowerCase().includes(search.toLowerCase()) || h.indo.toLowerCase().includes(search.toLowerCase()));

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background transition-colors duration-700">
      <main className="max-w-6xl mx-auto p-5 sm:p-6 lg:p-8 space-y-10 pt-8 pb-24">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in duration-1000">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Inspirasi <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-400 font-black">Ramadhan</span>
            </h1>
            <p className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              Kumpulan hadits pilihan untuk mempertebal iman
            </p>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari tema atau isi hadits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all text-sm font-medium"
            />
          </div>
        </header>

        {/* --- hadits grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {filteredHadits.map((hadits, index) => (
            <div
              key={hadits.id}
              className="group relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-7 sm:p-9 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Quote className="absolute -right-2 -bottom-2 w-32 h-32 opacity-5 text-emerald-500 rotate-12 group-hover:rotate-6 transition-transform duration-700" />

              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">{hadits.tema}</span>
                </div>

                <button
                  onClick={() => handleCopy(`${hadits.arab}\n\n${hadits.indo}\n(${hadits.perawi})`, hadits.id)}
                  className="p-2.5 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-emerald-500/10 hover:text-emerald-500 border border-zinc-200/50 dark:border-zinc-800/50 transition-all shadow-sm"
                  title="Salin Hadits"
                >
                  {copiedId === hadits.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative z-10 mb-8">
                <p className="font-arabic text-3xl sm:text-4xl text-right leading-[1.8] text-foreground font-medium drop-shadow-sm">{hadits.arab}</p>
              </div>

              <div className="mt-auto relative z-10">
                <div className="h-px w-full bg-linear-to-r from-emerald-500/20 via-transparent to-transparent mb-6"></div>
                <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed mb-4 pl-4 border-l-2 border-emerald-500/20">"{hadits.indo}"</p>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 tracking-[0.15em] uppercase">— {hadits.perawi}</p>
              </div>
            </div>
          ))}

          {filteredHadits.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-dashed border-zinc-300 dark:border-zinc-800">
              <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">Hadits tidak ditemukan. Coba kata kunci lain.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
