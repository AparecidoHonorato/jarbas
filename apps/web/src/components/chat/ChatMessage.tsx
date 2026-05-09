'use client';

import { motion } from 'framer-motion';
import type { Message } from '@jarbas/types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-jarbas-primary/10 border border-jarbas-primary/20 text-white'
            : 'bg-white/[0.02] border border-white/5 text-white/90'
        }`}
      >
        {!isUser && message.provider && (
          <span className="block text-[10px] uppercase tracking-wider text-jarbas-accent/60 font-mono mb-2">
            {message.provider} • {message.model}
          </span>
        )}
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
      </div>
    </motion.div>
  );
}
