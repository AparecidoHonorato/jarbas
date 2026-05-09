'use client';

'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chat';

export function CoreOrb() {
  const status = useChatStore((s) => s.status);
  const activeProvider = useChatStore((s) => s.activeProvider);

  const isActive = status === 'thinking' || status === 'streaming';

  const getProviderColor = () => {
    switch (activeProvider) {
      case 'openai': return '#10b981';
      case 'anthropic': return '#f59e0b';
      case 'gemini': return '#6366f1';
      default: return '#00d4ff';
    }
  };

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px solid rgba(0, 212, 255, 0.15)',
          borderTopColor: 'rgba(0, 212, 255, 0.4)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Second ring */}
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          border: '1px solid rgba(0, 212, 255, 0.1)',
          borderBottomColor: 'rgba(0, 255, 204, 0.3)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Third ring */}
      <motion.div
        className="absolute inset-4 rounded-full"
        style={{
          border: '1px dashed rgba(0, 212, 255, 0.08)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulse rings when active */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-3 rounded-full border border-jarbas-primary/20"
            animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border border-jarbas-primary/20"
            animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      {/* Core glow */}
      <motion.div
        className="w-14 h-14 rounded-full relative"
        animate={{
          scale: isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        {/* Inner gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${getProviderColor()}40, ${getProviderColor()}10 60%, transparent)`,
            boxShadow: `0 0 ${isActive ? '40' : '20'}px ${getProviderColor()}30, inset 0 0 20px ${getProviderColor()}10`,
          }}
        />
        {/* Center bright spot */}
        <div
          className="absolute inset-3 rounded-full"
          style={{
            background: `radial-gradient(circle, ${getProviderColor()}60 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Status label */}
      <div className="absolute -bottom-7 flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono" style={{ color: `${getProviderColor()}99` }}>
          {status === 'idle' ? 'ready' : status === 'thinking' ? 'routing' : 'streaming'}
        </span>
        {activeProvider && isActive && (
          <span className="text-[9px] text-white/20 font-mono mt-0.5">
            {activeProvider}
          </span>
        )}
      </div>
    </div>
  );
}
