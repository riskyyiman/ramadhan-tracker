'use client';

import { Home, Calendar, BookOpen, Settings, Moon, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useDailyReminder } from '@/hooks/useDailyReminder';
import { motion, LayoutGroup } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'History', icon: Calendar, href: '/history' },
  { name: 'Hadits', icon: Heart, href: '/hadits' },
  { name: 'Quran', icon: BookOpen, href: '/quran' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Navbar() {
  const pathname = usePathname();
  useDailyReminder();

  return (
    <LayoutGroup>
      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex sticky top-0 z-50 w-full bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-white/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3 group outline-none">
            <motion.div whileHover={{ rotate: 12, scale: 1.05 }} className="w-10 h-10 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Moon className="text-white w-5 h-5 fill-current" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none mb-0.5">Ramadhan</span>
              <span className="font-bold text-[9px] tracking-[0.3em] text-emerald-600 dark:text-emerald-400 uppercase leading-none">Kareem</span>
            </div>
          </Link>

          <div className="flex gap-1 p-1 bg-zinc-100/50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/30">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors duration-300 outline-none',
                    isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill-desktop"
                      className="absolute inset-0 bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn('w-4 h-4', isActive && 'scale-110')} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/*MOBILE BOTTOM NAV=*/}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-stretch h-16 px-2 pb-safe">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="relative flex flex-1 flex-col items-center justify-center outline-none transition-all">
                {/* Indikator Aktif di Atas*/}
                {isActive && <motion.div layoutId="active-line-mobile" className="absolute top-0 w-12 h-0.75 bg-emerald-500 rounded-b-full" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}

                <div className={cn('flex flex-col items-center gap-1 transition-all duration-300', isActive ? '-translate-y-0.5' : 'translate-y-0')}>
                  <item.icon className={cn('w-6 h-6 transition-colors', isActive ? 'text-emerald-500' : 'text-zinc-500')} />
                  <span className={cn('text-[10px] font-medium tracking-tight transition-colors', isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500')}>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </LayoutGroup>
  );
}
