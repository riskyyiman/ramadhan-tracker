import React from 'react';
import Link from 'next/link';
import { Heart, Github, Twitter, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5 pt-16 pb-8 mt-auto">
      {/* Container utama */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid responsif*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
          <div className="lg:col-span-2 flex flex-col space-y-5">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Ramadhan Tracker</h2>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              Pendamping ibadah digital untuk memaksimalkan bulan suci Ramadhan 1447 H. Pantau mutaba'ah harian, baca Al-Qur'an, dan temukan arah kiblat dalam satu platform modern dan responsif.
            </p>

            {/* Ikon Media Sosial / Kontak */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com/riskyyiman" className="p-2 rounded-full bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-400 transition-all duration-300">
                <Github size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-400 transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-400 transition-all duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Bagian Navigasi */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-white font-semibold tracking-wide">Eksplorasi</h3>
            <ul className="flex flex-col space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/quran" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Al-Qur'an Online
                </Link>
              </li>
              <li>
                <Link href="/hadits" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Kumpulan Hadits
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Riwayat Mutaba'ah
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Bagian Info & Lokasi */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-white font-semibold tracking-wide">Informasi</h3>
            <ul className="flex flex-col space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/settings" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Pengaturan Akun
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-emerald-400 hover:translate-x-1 inline-block transition-all duration-200">
                  Tentang Pengembang
                </Link>
              </li>
              <li className="flex items-start gap-2 pt-3 mt-2">
                <MapPin size={16} className="mt-0.5 text-emerald-500 shrink-0" />
                <span className="leading-snug text-white font-medium">Purwokerto, Jawa Tengah</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex justify-center items-center text-sm text-gray-500">
          <p>
            © {currentYear} Ramadhan Tracker. Copyright by <span className="text-gray-300 font-medium ml-1">Risky iman lael prasetio</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
