'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/store/chat';

const PROVIDERS = [
  { id: null, label: 'Auto', desc: 'Roteamento inteligente' },
  { id: 'openai', label: 'GPT-4o', desc: 'Criativo e versátil' },
  { id: 'anthropic', label: 'Claude', desc: 'Código e raciocínio' },
  { id: 'groq', label: 'Groq', desc: 'Rápido e gratuito' },
];

export function ProviderSelector() {
  const selectedProvider = useChatStore((s) => s.selectedProvider);
  const setProvider = useChatStore((s) => s.setProvider);

  return (
    <div className="flex items-center gap-1.5">
      {PROVIDERS.map((p) => (
        <button
          key={p.id ?? 'auto'}
          onClick={() => setProvider(p.id)}
          className={`relative px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
            selectedProvider === p.id
              ? 'text-jarbas-primary bg-jarbas-primary/10 border border-jarbas-primary/30'
              : 'text-white/30 hover:text-white/60 border border-transparent hover:border-white/10'
          }`}
          title={p.desc}
        >
          {selectedProvider === p.id && (
            <motion.div
              layoutId="provider-indicator"
              className="absolute inset-0 rounded border border-jarbas-primary/30 bg-jarbas-primary/5"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative">{p.label}</span>
        </button>
      ))}
    </div>
  );
}