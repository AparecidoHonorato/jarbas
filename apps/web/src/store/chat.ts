import { create } from 'zustand';
import type { Message } from '@jarbas/types';

interface ChatState {
  messages: Message[];
  status: 'idle' | 'thinking' | 'streaming';
  activeProvider: string | null;
  activeModel: string | null;
  routingReason: string | null;
  selectedProvider: string | null;
  conversationId: string;
  sendMessage: (content: string) => void;
  setProvider: (provider: string | null) => void;
  clearChat: () => void;
}

type ActionType = 'url' | 'clipboard' | 'search' | 'multi' | 'custom';

interface ActionResult {
  type: ActionType;
  action: any;
  label: string;
}

const SITES: Record<string, { url: string; label: string }> = {
  youtube: { url: 'https://youtube.com', label: 'YouTube 🎬' },
  yt: { url: 'https://youtube.com', label: 'YouTube 🎬' },
  google: { url: 'https://google.com', label: 'Google 🔍' },
  gmail: { url: 'https://mail.google.com', label: 'Gmail 📧' },
  whatsapp: { url: 'https://web.whatsapp.com', label: 'WhatsApp 💬' },
  instagram: { url: 'https://instagram.com', label: 'Instagram 📸' },
  twitter: { url: 'https://x.com', label: 'Twitter 🐦' },
  spotify: { url: 'https://open.spotify.com', label: 'Spotify 🎵' },
  netflix: { url: 'https://netflix.com', label: 'Netflix 🎥' },
  github: { url: 'https://github.com', label: 'GitHub 💻' },
  linkedin: { url: 'https://linkedin.com', label: 'LinkedIn 💼' },
  telegram: { url: 'https://web.telegram.org', label: 'Telegram ✈️' },
  reddit: { url: 'https://reddit.com', label: 'Reddit 🤖' },
  twitch: { url: 'https://twitch.tv', label: 'Twitch 🎮' },
  discord: { url: 'https://discord.com/app', label: 'Discord 🎙️' },
  chatgpt: { url: 'https://chat.openai.com', label: 'ChatGPT 🤖' },
  shopee: { url: 'https://shopee.com.br', label: 'Shopee 🛍️' },
  amazon: { url: 'https://amazon.com.br', label: 'Amazon 📦' },
  mercadolivre: { url: 'https://mercadolivre.com.br', label: 'Mercado Livre 🛒' },
  nubank: { url: 'https://nubank.com.br', label: 'Nubank 💜' },
  ifood: { url: 'https://ifood.com.br', label: 'iFood 🍔' },
  maps: { url: 'https://maps.google.com', label: 'Google Maps 🗺️' },
  drive: { url: 'https://drive.google.com', label: 'Google Drive 📁' },
  calendar: { url: 'https://calendar.google.com', label: 'Google Calendar 📅' },
  notion: { url: 'https://notion.so', label: 'Notion 📝' },
  figma: { url: 'https://figma.com', label: 'Figma 🎨' },
};

const OPEN_INTENT = /\b(abr[ia]r?|abre|abrir|open|acessa|vai|vá|entra|mostra|ir para|leva|navega|coloca|ligar|conecta)\b/i;
const SEARCH_INTENT = /\b(pesquisa|busca|procura|search|googla|busque|pesquise|encontra|acha)\b/i;
const MUSIC_INTENT = /\b(toca|coloca|reproduz|play|coloque|reproduza|toque|ouvir|quero ouvir)\b/i;
const STOP_INTENT = /\b(para|parar|parou|pausar|pausa|stop|cala|silêncio|chega)\b/i;
const CALC_INTENT = /(\d+)\s*([+\-*\/x÷])\s*(\d+)/;

async function detectAction(content: string): Promise<ActionResult | null> {
  const lower = content.toLowerCase().trim();

  // PARAR FALA
  if (STOP_INTENT.test(lower) && lower.split(' ').length <= 3) {
    window.speechSynthesis?.cancel();
    return { type: 'custom', action: '🔇 Pausado.', label: '🔇 Áudio pausado' };
  }

  // CALCULADORA
  const calcMatch = lower.match(CALC_INTENT);
  if (calcMatch) {
    const a = parseFloat(calcMatch[1]);
    const op = calcMatch[2];
    const b = parseFloat(calcMatch[3]);
    let result = 0;
    if (op === '+') result = a + b;
    else if (op === '-') result = a - b;
    else if (op === '*' || op === 'x') result = a * b;
    else if (op === '/' || op === '÷') result = b !== 0 ? a / b : 0;
    return { type: 'custom', action: `🧮 ${a} ${op} ${b} = **${result}**`, label: 'Calculando' };
  }

  // MÚSICA
  if (MUSIC_INTENT.test(lower)) {
    const musicMatch = lower.match(/(?:toca|coloca|reproduz|play|coloque|reproduza|toque|ouvir|quero ouvir)\s+(?:a\s+)?(?:música\s+)?(.+?)(?:\s+no\s+(?:spotify|youtube|yt))?$/i);
    if (musicMatch && musicMatch[1]) {
      const name = musicMatch[1].trim();
      const url = `https://open.spotify.com/search/${encodeURIComponent(name)}`;
      window.open(url, '_blank');
      return { type: 'url', action: url, label: `🎵 Tocando: ${name}` };
    }
  }

  // PESQUISA EM PLATAFORMA ESPECÍFICA
  const platformSearchMatch = lower.match(/(?:pesquisa|busca|procura|search)\s+(.+?)\s+(?:no|em|na)\s+(google|youtube|yt|github|reddit)/i);
  if (platformSearchMatch) {
    const query = platformSearchMatch[1].trim();
    const platform = platformSearchMatch[2].toLowerCase().replace('yt', 'youtube');
    const urls: Record<string, string> = {
      google: `https://google.com/search?q=${encodeURIComponent(query)}`,
      youtube: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
      github: `https://github.com/search?q=${encodeURIComponent(query)}`,
      reddit: `https://reddit.com/search?q=${encodeURIComponent(query)}`,
    };
    const url = urls[platform];
    if (url) {
      window.open(url, '_blank');
      return { type: 'search', action: url, label: `🔍 Pesquisando "${query}" no ${platform}` };
    }
  }

  // ABRIR SITE ESPECÍFICO
  const hasOpenIntent = OPEN_INTENT.test(lower);
  const hasSearchIntent = SEARCH_INTENT.test(lower);

  // Verifica cada site no dicionário
  for (const [key, site] of Object.entries(SITES)) {
    const sitePattern = new RegExp(`\\b${key}\\b`, 'i');
    if (sitePattern.test(lower)) {
      if (hasOpenIntent || lower.split(' ').length <= 4) {
        window.open(site.url, '_blank');
        return { type: 'url', action: site.url, label: `Abrindo ${site.label}` };
      }
    }
  }

  // PESQUISA GENÉRICA NO GOOGLE
  if (hasSearchIntent) {
    const searchMatch = lower.match(/(?:pesquisa|busca|procura|search|googla|busque|pesquise|encontra|acha)\s+(?:sobre\s+)?(.+)/i);
    if (searchMatch && searchMatch[1]) {
      const query = searchMatch[1].trim();
      const url = `https://google.com/search?q=${encodeURIComponent(query)}`;
      window.open(url, '_blank');
      return { type: 'search', action: url, label: `🔍 Pesquisando: "${query}"` };
    }
  }

  return null;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  status: 'idle',
  activeProvider: null,
  activeModel: null,
  routingReason: null,
  selectedProvider: null,
  conversationId: crypto.randomUUID(),

  setProvider: (provider) => set({ selectedProvider: provider }),

  clearChat: () => set({
    messages: [],
    status: 'idle',
    activeProvider: null,
    activeModel: null,
    routingReason: null,
    conversationId: crypto.randomUUID(),
  }),

  sendMessage: async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    // Detecta ação antes de chamar a IA
    const actionResult = await detectAction(content);
    if (actionResult) {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: actionResult.label,
        createdAt: new Date().toISOString(),
      };

      set((s) => ({
        messages: [...s.messages, userMessage, assistantMessage],
        status: 'idle',
        routingReason: null,
      }));
      return;
    }

    set((s) => ({
      messages: [...s.messages, userMessage],
      status: 'thinking',
      routingReason: null,
    }));

    try {
      const { messages: currentMessages, selectedProvider, conversationId } = get();
      const messages = currentMessages.slice(0, -1);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationId,
          provider: selectedProvider,
          history: messages.slice(-20).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream');

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMessage],
        status: 'streaming',
      }));

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const event = JSON.parse(data);
            if (event.type === 'token') {
              fullContent += event.data;
              set((s) => ({
                messages: s.messages.map((m) =>
                  m.id === assistantMessage.id ? { ...m, content: fullContent } : m
                ),
              }));
            } else if (event.type === 'metadata') {
              const meta = event.metadata;
              set((s) => ({
                activeProvider: meta?.provider || null,
                activeModel: meta?.model || null,
                routingReason: meta?.routingReason || null,
                messages: s.messages.map((m) =>
                  m.id === assistantMessage.id
                    ? { ...m, provider: meta?.provider, model: meta?.model }
                    : m
                ),
              }));
            } else if (event.type === 'error') {
              fullContent += `\n\n⚠️ ${event.data}`;
              set((s) => ({
                messages: s.messages.map((m) =>
                  m.id === assistantMessage.id ? { ...m, content: fullContent } : m
                ),
              }));
            }
          } catch {}
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '⚠️ Erro de conexão. Verifique se o servidor está rodando.',
        createdAt: new Date().toISOString(),
      };
      set((s) => ({ messages: [...s.messages, errorMessage] }));
    } finally {
      set({ status: 'idle' });
    }
  },
}));