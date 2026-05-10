import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JARBAS • Neural AI System',
  description:
    'Sistema de inteligência artificial avançado inspirado em interfaces futuristas.',
  keywords: [
    'AI',
    'JARBAS',
    'Assistant',
    'Artificial Intelligence',
    'Neural System',
    'Cyber Interface',
  ],
  authors: [{ name: 'Junior' }],
  themeColor: '#00F0FF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className="dark scroll-smooth"
    >
      <body
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#030712]
          text-white
          font-sans
          antialiased
          selection:bg-cyan-400/30
          selection:text-white
        "
      >
        {/* FUNDO GLOBAL */}
        <div className="fixed inset-0 -z-50 overflow-hidden">
          
          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.08]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* GLOW CENTRAL */}
          <div className="absolute left-1/2 top-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />

          {/* ORBS */}
          <div className="absolute top-[-150px] left-[-100px] w-[450px] h-[450px] rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="absolute bottom-[-180px] right-[-120px] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />

          {/* VINHETA */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.9)_100%)]" />

          {/* NOISE */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>

        {/* LINHA SUPERIOR */}
        <div className="fixed top-0 left-0 w-full h-[1px] bg-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.8)] z-50" />

        {/* CONTEÚDO */}
        <main className="relative z-10 flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}