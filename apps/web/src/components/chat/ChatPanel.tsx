'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ProviderSelector } from './ProviderSelector';
import { RoutingBadge } from './RoutingBadge';
import { useRef, useEffect } from 'react';

export function ChatPanel() {
  const messages = useChatStore((s) => s.messages);
  const status = useChatStore((s) => s.status);
  const clearChat = useChatStore((s) => s.clearChat);
const sendMessage = useChatStore((s) => s.sendMessage);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full glass-panel neon-border">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <ProviderSelector />
        <div className="flex items-center gap-2">
          <RoutingBadge />
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-[10px] font-mono text-white/20 hover:text-white/50 uppercase tracking-wider transition-colors px-2 py-1"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center gap-4"
            >
              <div className="text-center space-y-3">
                <p className="text-white/30 font-mono text-xs uppercase tracking-widest">
                  JARBAS v0.1.0 • Multi-AI Assistant
                </p>
                <p className="text-white/15 text-sm max-w-md">
                  Roteamento inteligente ativo. Sua mensagem será analisada e
                  direcionada ao melhor modelo de IA automaticamente.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 max-w-sm w-full">
                {[
                  'Explique como funciona o React Server Components',
                  'Crie uma função de fibonacci em Rust',
                  'Resuma as vantagens de microserviços',
                  'Quem é você?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-left text-[11px] text-white/25 hover:text-white/50 border border-white/5 hover:border-white/10 rounded-lg px-3 py-2 transition-all hover:bg-white/[0.02]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
        </AnimatePresence>

        {/* Thinking indicator */}
        {status === 'thinking' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2"
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-jarbas-primary/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-jarbas-primary/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-jarbas-primary/60 animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-[10px] font-mono text-white/30">Analisando e roteando...</span>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-4">
        <ChatInput />
      </div>
    </div>
  );
}
