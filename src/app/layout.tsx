import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import PageTransition from '../components/layout/PageTransition.';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ramadhan Tracker 1447 H - Pendamping Ibadah Puasa',
  description: "Aplikasi modern untuk melacak mutaba'ah harian, jadwal shalat, dan membaca Al-Qur'an di bulan suci Ramadhan 1447 H.",
  keywords: ['Ramadhan Tracker', 'Jadwal Shalat', 'Mutabaah Yaumiyah', 'Al-Quran Online', 'Ramadhan 2026'],
  authors: [{ name: 'Risky iman lael prasetio' }],
  icons: {
    icon: '/ramadhankareem.png',
    shortcut: '/ramadhankareem.png',
    apple: '/ramadhankareem.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-[hsl(var(--background))]`}>
        <NextTopLoader color="#10b981" />
        <Navbar />
        <main className="md:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
