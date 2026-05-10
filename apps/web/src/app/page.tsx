import { HudLayout } from '@/components/hud/HudLayout';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { CoreOrb } from '@/components/hud/CoreOrb';
import { SystemStatusBar } from '@/components/hud/SystemStatusBar';

export default function Home() {
  return (
    <HudLayout>
      <div className="relative h-screen overflow-y-auto overflow-x-hidden bg-[#020617] text-white scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-400/30">

        {/* BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden">

          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.08]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.18)_1px,transparent_1px)] bg-[size:55px_55px]" />
          </div>

          {/* SCANLINES */}
          <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] bg-[length:100%_6px]" />

          {/* LIGHT */}
          <div className="absolute left-1/2 top-1/2 w-[1400px] h-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[220px]" />

          <div className="absolute top-[-250px] left-[-250px] w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[160px]" />

          <div className="absolute bottom-[-300px] right-[-300px] w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-[180px]" />

          {/* ENERGY LINES */}
          <div className="absolute top-0 left-1/2 h-full w-[1px] bg-cyan-400/20 shadow-[0_0_30px_rgba(0,255,255,0.9)]" />

          <div className="absolute top-1/2 left-0 h-[1px] w-full bg-cyan-400/10 shadow-[0_0_30px_rgba(0,255,255,0.9)]" />

          {/* EXTRA LIGHTS */}
          <div className="absolute left-[20%] top-[15%] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />

          <div className="absolute right-[15%] bottom-[20%] h-52 w-52 rounded-full bg-blue-400/10 blur-3xl animate-pulse" />

          {/* VIGNETTE */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.96)_100%)]" />
        </div>

        {/* HUD CORNERS */}
        <div className="fixed top-6 left-6 z-50 w-24 h-24 border-l border-t border-cyan-400/40">
          <div className="absolute left-0 top-0 h-2 w-14 bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,1)]" />
        </div>

        <div className="fixed top-6 right-6 z-50 w-24 h-24 border-r border-t border-cyan-400/40">
          <div className="absolute right-0 top-0 h-2 w-14 bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,1)]" />
        </div>

        <div className="fixed bottom-6 left-6 z-50 w-24 h-24 border-l border-b border-cyan-400/40">
          <div className="absolute left-0 bottom-0 h-2 w-14 bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,1)]" />
        </div>

        <div className="fixed bottom-6 right-6 z-50 w-24 h-24 border-r border-b border-cyan-400/40">
          <div className="absolute right-0 bottom-0 h-2 w-14 bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,1)]" />
        </div>

        {/* MAIN */}
        <div className="relative z-10 flex min-h-screen flex-col">

          {/* STATUS */}
          <div className="relative z-20">
            <SystemStatusBar />
          </div>

          {/* CONTENT */}
          <main className="relative flex flex-1 items-start justify-center px-8 pt-0 pb-20">

            <div className="relative -mt-24 flex min-h-screen w-full max-w-7xl flex-col items-center justify-start">

              {/* CORE */}
              <div className="relative -mt-4 mb-0 scale-75">

                <div className="absolute inset-[-80px] rounded-full border border-cyan-400/10 animate-spin" />

                <div className="absolute inset-[-120px] rounded-full border border-cyan-400/5 animate-[spin_18s_linear_infinite_reverse]" />

                <div className="absolute inset-[-170px] rounded-full border border-cyan-400/10 animate-pulse" />

                <div className="absolute inset-0 scale-[2.8] rounded-full bg-cyan-400/20 blur-[140px] animate-pulse" />

                <div className="absolute inset-[-35px] rounded-full border border-cyan-300/20 animate-ping" />

                <div className="relative">
                  <CoreOrb />
                </div>
              </div>

              {/* TITLE */}
              <div className="relative mb-4 -mt-2 flex flex-col items-center">

                <div className="absolute inset-0 blur-3xl bg-cyan-400/30" />

                <h1 className="relative bg-gradient-to-r from-cyan-100 via-cyan-300 to-blue-400 bg-clip-text text-5xl font-black tracking-[0.6em] text-transparent md:text-7xl drop-shadow-[0_0_50px_rgba(0,255,255,0.65)]">
                  JARBAS
                </h1>

                <div className="mt-2 flex items-center gap-3">
                  <div className="h-[1px] w-16 bg-cyan-400/30" />

                  <p className="text-[10px] font-mono uppercase tracking-[0.7em] text-cyan-200/60">
                    Quantum Neural Intelligence
                  </p>

                  <div className="h-[1px] w-16 bg-cyan-400/30" />
                </div>

                {/* BOTÃO GITHUB */}
                <a
                  href="https://github.com/AparecidoHonorato/jarbas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mt-8 overflow-hidden rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-8 py-4 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan-300 hover:bg-cyan-400/20 hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]"
                >
                  {/* GLOW */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  {/* LIGHT LINE */}
                  <div className="absolute left-[-100%] top-0 h-full w-1/2 rotate-12 bg-white/10 blur-xl transition-all duration-700 group-hover:left-[150%]" />

                  {/* CONTENT */}
                  <div className="relative flex items-center gap-4">

                    {/* ICON */}
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-black/30">

                      <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-xl" />

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 text-cyan-300"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.486 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 
                          0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 
                          1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 
                          0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 
                          1.705.115 2.504.337 1.909-1.296 2.748-1.027 2.748-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 
                          1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 
                          0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.481A10.019 10.019 0 0022 12.017C22 6.486 
                          17.523 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    {/* TEXT */}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
                        ACCESS SOURCE
                      </span>

                      <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-cyan-200/50">
                        Github Repository
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* CHAT */}
              <div className="relative flex w-full flex-1 -mt-10 pb-10">

                {/* GLOW */}
                <div className="absolute inset-0 rounded-[40px] bg-cyan-400/10 blur-3xl" />

                {/* PANEL */}
                <div className="relative flex w-full flex-col overflow-hidden rounded-[40px] border border-cyan-400/10 bg-transparent backdrop-blur-[8px]">

                  {/* HEADER */}
                  <div className="relative flex items-center justify-between border-b border-cyan-400/10 px-8 py-3">

                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-cyan-400/5" />

                    {/* ROBÔ */}
                    <div className="relative flex items-center gap-4">

                      {/* ROBOT */}
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-xl shadow-[0_0_35px_rgba(0,255,255,0.25)]">

                        <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-xl" />

                        <div className="absolute top-5 left-4 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(0,255,255,1)] animate-pulse" />

                        <div className="absolute top-5 right-4 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(0,255,255,1)] animate-pulse" />

                        <div className="absolute bottom-4 h-1 w-6 rounded-full bg-cyan-300/80 shadow-[0_0_10px_rgba(0,255,255,1)]" />

                        <div className="absolute -top-3 h-4 w-[2px] bg-cyan-300" />

                        <div className="absolute -top-4 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(0,255,255,1)] animate-pulse" />
                      </div>

                      {/* INFO */}
                      <div className="flex flex-col">
                        <h2 className="bg-gradient-to-r from-cyan-200 to-cyan-400 bg-clip-text text-lg font-black tracking-[0.3em] text-transparent">
                          JARBAS AI
                        </h2>

                        <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.45em] text-cyan-200/50">
                          Quantum Assistant Online
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="relative flex items-center gap-3">

                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-emerald-400 blur-md animate-pulse" />

                        <div className="relative h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_25px_rgba(0,255,120,1)]" />
                      </div>

                      <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-300">
                        ONLINE
                      </span>
                    </div>
                  </div>

                  {/* CHAT CONTENT */}
                  <div className="relative flex-1 overflow-y-auto px-2 py-2 md:px-3 md:py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-cyan-400/20">

                    {/* GRID */}
                    <div className="absolute inset-0 opacity-[0.03]">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.15)_1px,transparent_1px)] bg-[size:30px_30px]" />
                    </div>

                    {/* LIGHT */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/[0.02] to-transparent" />

                    {/* CHAT PANEL */}
                    <div className="relative h-full">
                      <ChatPanel />
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </HudLayout>
  );
}