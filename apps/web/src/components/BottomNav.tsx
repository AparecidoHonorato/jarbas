'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    {
      href: '/',
      label: 'JARBAS',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      href: '/agente',
      label: 'VAGAS',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-cyan-400/15 bg-black/80 backdrop-blur-xl">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-all ${
              active
                ? 'text-cyan-300'
                : 'text-white/25 hover:text-white/50'
            }`}
          >
            <div className={`relative ${active ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : ''}`}>
              {tab.icon}
              {active && (
                <span className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,255,255,1)]" />
              )}
            </div>
            <span className={`text-[8px] font-mono tracking-[0.2em] ${active ? 'text-cyan-300' : 'text-white/20'}`}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}