import { HudLayout } from '@/components/hud/HudLayout';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { CoreOrb } from '@/components/hud/CoreOrb';
import { SystemStatusBar } from '@/components/hud/SystemStatusBar';

export default function Home() {
  return (
    <HudLayout>
      <div className="flex flex-col h-screen">
        <SystemStatusBar />
        <main className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 h-full flex flex-col">
            <div className="flex-shrink-0 flex justify-center py-8">
              <CoreOrb />
            </div>
            <div className="flex-1 min-h-0 pb-4">
              <ChatPanel />
            </div>
          </div>
        </main>
      </div>
    </HudLayout>
  );
}
