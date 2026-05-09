'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { useEffect, useState } from 'react';

export function RoutingBadge() {
  const routingReason = useChatStore((s) => s.routingReason);
  const activeProvider = useChatStore((s) => s.activeProvider);
  const activeModel = useChatStore((s) => s.activeModel);
  const status = useChatStore((s) => s.status);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'streaming' || status === 'thinking') {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
  }, [status]);

  return (
    <AnimatePresence>
      {visible && activeProvider && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-jarbas-primary/5 border border-jarbas-primary/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-jarbas-accent animate-pulse" />
          <span className="text-[10px] font-mono text-white/50">
            {activeProvider}/{activeModel}
          </span>
          {routingReason && (
            <span className="text-[9px] font-mono text-jarbas-primary/40 hidden sm:inline">
              • {routingReason}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}