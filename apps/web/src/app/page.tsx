import { HudLayout } from '@/components/hud/HudLayout';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { SystemStatusBar } from '@/components/hud/SystemStatusBar';

export default function Home() {
  return (
    <HudLayout>
      <div className="relative h-screen overflow-hidden bg-[#020617] text-white flex flex-col">

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.18)_1px,transparent_1px)] bg-[size:55px_55px]" />
          </div>
          <div className="absolute left-1/2 top-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[180px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.96)_100%)]" />
        </div>

        {/* HUD CORNERS - menores no mobile */}
        <div className="fixed top-3 left-3 z-50 w-12 h-12 border-l border-t border-cyan-400/40 pointer-events-none">
          <div className="absolute left-0 top-0 h-[2px] w-6 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]" />
        </div>
        <div className="fixed top-3 right-3 z-50 w-12 h-12 border-r border-t border-cyan-400/40 pointer-events-none">
          <div className="absolute right-0 top-0 h-[2px] w-6 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]" />
        </div>
        <div className="fixed bottom-3 left-3 z-50 w-12 h-12 border-l border-b border-cyan-400/40 pointer-events-none">
          <div className="absolute left-0 bottom-0 h-[2px] w-6 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]" />
        </div>
        <div className="fixed bottom-3 right-3 z-50 w-12 h-12 border-r border-b border-cyan-400/40 pointer-events-none">
          <div className="absolute right-0 bottom-0 h-[2px] w-6 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,1)]" />
        </div>

        {/* STATUS BAR */}
        <div className="relative z-20 flex-shrink-0">
          <SystemStatusBar />
        </div>

        {/* HEADER COMPACTO */}
        <div className="relative z-10 flex-shrink-0 flex items-center justify-between px-5 py-2 border-b border-cyan-400/10 bg-black/20 backdrop-blur-sm">
          {/* ROBÔ + NOME */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
              <div className="absolute top-[7px] left-[6px] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,255,255,1)] animate-pulse" />
              <div className="absolute top-[7px] right-[6px] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,255,255,1)] animate-pulse" />
              <div className="absolute bottom-[6px] h-[3px] w-4 rounded-full bg-cyan-300/80" />
              <div className="absolute -top-2 h-3 w-[2px] bg-cyan-300" />
              <div className="absolute -top-3 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(0,255,255,1)] animate-pulse" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-cyan-200 to-cyan-400 bg-clip-text text-sm font-black tracking-[0.3em] text-transparent">
                JARBAS AI
              </h1>
              <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-cyan-200/40">
                Quantum Neural Intelligence
              </p>
            </div>
          </div>

          {/* STATUS + GITHUB */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(0,255,120,1)]">
                <div className="absolute inset-0 rounded-full bg-emerald-400 blur-sm animate-pulse" />
              </div>
              <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-emerald-300">ONLINE</span>
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

        {/* CHAT — ocupa todo o espaço restante */}
        <div className="relative z-10 flex-1 overflow-hidden">
          <div className="absolute inset-0 rounded-none border-0 bg-transparent backdrop-blur-[8px]">
            <div className="relative h-full overflow-y-auto px-2 py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-400/20">
              <ChatPanel />
            </div>
          </div>
        </div>

      </div>
    </HudLayout>
  );
}
