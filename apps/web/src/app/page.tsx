import { HudLayout } from '@/components/hud/HudLayout';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { SystemStatusBar } from '@/components/hud/SystemStatusBar';
 
export default function Home() {
  return (
    <HudLayout>
      <div className="fixed inset-0 bg-[#020617] text-white flex flex-col">
 
        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.18)_1px,transparent_1px)] bg-[size:55px_55px]" />
          </div>
          <div className="absolute left-1/2 top-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[180px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.96)_100%)]" />
        </div>
 
        {/* HUD CORNERS */}
        <div className="fixed top-3 left-3 z-50 w-10 h-10 border-l border-t border-cyan-400/40 pointer-events-none">
          <div className="absolute left-0 top-0 h-[2px] w-5 bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,1)]" />
        </div>
        <div className="fixed top-3 right-3 z-50 w-10 h-10 border-r border-t border-cyan-400/40 pointer-events-none">
          <div className="absolute right-0 top-0 h-[2px] w-5 bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,1)]" />
        </div>
        <div className="fixed bottom-3 left-3 z-50 w-10 h-10 border-l border-b border-cyan-400/40 pointer-events-none">
          <div className="absolute left-0 bottom-0 h-[2px] w-5 bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,1)]" />
        </div>
        <div className="fixed bottom-3 right-3 z-50 w-10 h-10 border-r border-b border-cyan-400/40 pointer-events-none">
          <div className="absolute right-0 bottom-0 h-[2px] w-5 bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,1)]" />
        </div>
 
        {/* STATUS BAR */}
        <div className="relative z-20 flex-shrink-0">
          <SystemStatusBar />
        </div>
 
        {/* HEADER COMPACTO */}
        <div className="relative z-10 flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-cyan-400/10 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex-shrink-0">
              <div className="absolute top-[6px] left-[5px] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(0,255,255,1)] animate-pulse" />
              <div className="absolute top-[6px] right-[5px] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_rgba(0,255,255,1)] animate-pulse" />
              <div className="absolute bottom-[5px] h-[2px] w-3.5 rounded-full bg-cyan-300/80" />
              <div className="absolute -top-1.5 h-2.5 w-[2px] bg-cyan-300" />
              <div className="absolute -top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,255,255,1)] animate-pulse" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-cyan-200 to-cyan-400 bg-clip-text text-sm font-black tracking-[0.25em] text-transparent leading-none">
                JARBAS AI
              </h1>
              <p className="text-[8px] font-mono uppercase tracking-[0.25em] text-cyan-200/40 mt-0.5">
                Quantum Neural Intelligence
              </p>
            </div>
          </div>
 
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(0,255,120,1)]">
                <div className="absolute inset-0 rounded-full bg-emerald-400 blur-sm animate-pulse" />
              </div>
              <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-emerald-300">ONLINE</span>
            </div>
            <a
              href="https://github.com/AparecidoHonorato/jarbas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-7 w-7 rounded-lg border border-cyan-400/20 bg-cyan-400/10 hover:border-cyan-300 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-cyan-300">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.486 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.027 2.748-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0022 12.017C22 6.486 17.523 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
 
        {/* CHAT — flex-1 + min-h-0 para ocupar espaço restante sem overflow */}
        <div className="relative z-10 flex-1 min-h-0">
          <ChatPanel />
        </div>
 
      </div>
    </HudLayout>
  );
}
 