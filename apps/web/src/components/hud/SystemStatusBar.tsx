'use client';

import { useChatStore } from '@/store/chat';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function SystemStatusBar() {
  const activeProvider = useChatStore((s) => s.activeProvider);
  const status = useChatStore((s) => s.status);
  const messages = useChatStore((s) => s.messages);
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-2.5 border-b border-white/5 bg-black/20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-jarbas-primary"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-jarbas-primary font-mono text-sm font-bold tracking-[0.15em]">
            JARBAS
          </span>
        </div>
        <span className="text-white/10 text-[10px] font-mono">v0.1.0-alpha</span>
        <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-white/20">
          <span className="w-1 h-1 rounded-full bg-green-500/60" />
          <span>multi-model</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono text-white/30">
        {status !== 'idle' && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-jarbas-accent/70"
          >
            <div className="w-1 h-1 rounded-full bg-jarbas-accent animate-pulse" />
            {status === 'thinking' ? 'ROUTING' : 'STREAMING'}
          </motion.span>
        )}
        <span className="hidden sm:inline">{messages.length} msgs</span>
        <span className="tabular-nums">{time}</span>
        <span className="text-green-400/50">SYS:OK</span>
      </div>
    </header>
  );
}
