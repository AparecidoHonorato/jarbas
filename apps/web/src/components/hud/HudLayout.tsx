'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HudLayoutProps {
  children: ReactNode;
}

export function HudLayout({ children }: HudLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen"
    >
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-jarbas-secondary/[0.03] rounded-full blur-[100px]" />
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-jarbas-primary/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Scan line effect */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.015]">
        <div className="absolute inset-0 animate-scan-line bg-gradient-to-b from-transparent via-jarbas-primary to-transparent h-[200%]" />
      </div>

      {/* Corner HUD decorations */}
      <div className="fixed top-0 left-0 w-16 h-16 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-jarbas-primary/30 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-jarbas-primary/30 to-transparent" />
      </div>
      <div className="fixed top-0 right-0 w-16 h-16 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-jarbas-primary/30 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-jarbas-primary/30 to-transparent" />
      </div>
      <div className="fixed bottom-0 left-0 w-16 h-16 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-jarbas-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gradient-to-t from-jarbas-primary/30 to-transparent" />
      </div>
      <div className="fixed bottom-0 right-0 w-16 h-16 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-jarbas-primary/30 to-transparent" />
        <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-jarbas-primary/30 to-transparent" />
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 pointer-events-none hud-grid opacity-30" />

      {children}
    </motion.div>
  );
}
