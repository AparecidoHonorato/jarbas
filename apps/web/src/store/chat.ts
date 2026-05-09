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

// Sistema de ações avançadas do JARBAS
type ActionType = 'url' | 'clipboard' | 'search' | 'multi' | 'custom';

interface Action {
  type: ActionType;
  pattern: RegExp;
  label: string;
  execute: (match: RegExpMatchArray | null) => Promise<{ success: boolean; message: string }>;
}

const ADVANCED_ACTIONS: Action[] = [
  // COPIAR TEXTO
  {
    type: 'clipboard',
    pattern: /\b(?:copia|copie|cópia)\b\s+(?:o\s+)?texto\s+(.+?)(?:\s+para\s+clipboard)?$/i,
    label: 'Copiando texto',
    execute: async (match) => {
      if (match && match[1]) {
        try {
          await navigator.clipboard.writeText(match[1].trim());
          return { success: true, message: `✓ Texto copiado: "${match[1].trim()}"` };
        } catch {
          return { success: false, message: '⚠️ Erro ao copiar' };
        }
      }
      return { success: false, message: '⚠️ Nenhum texto para copiar' };
    },
  },
  // ABRIR MÚLTIPLOS SITES
  {
    type: 'multi',
    pattern: /\b(?:abre|abra)\b.*\b(?:youtube|gmail|github|google)\b.*(?:\be\b|\,).*/i,
    label: 'Abrindo múltiplas abas',
    execute: async (match) => {
      const urls: Record<string, string> = {
        youtube: 'https://youtube.com',
        gmail: 'https://mail.google.com',
        github: 'https://github.com',
        google: 'https://google.com',
      };
      const text = match?.[0]?.toLowerCase() || '';
      Object.entries(urls).forEach(([name, url]) => {
        if (text.includes(name)) {
          window.open(url, '_blank');
        }
      });
      return { success: true, message: '✓ Abas abertas' };
    },
  },
  // BUSCA AVANÇADA
  {
    type: 'search',
    pattern: /\b(?:pesquisa|busca|procura)\b\s+(?:sobre\s+)?(.+?)\s+(?:em|no)\s+(google|youtube|github|reddit)/i,
    label: 'Pesquisa avançada',
    execute: async (match) => {
      if (match && match[1] && match[2]) {
        const query = encodeURIComponent(match[1].trim());
        const platform = match[2].toLowerCase();
        const urls: Record<string, string> = {
          google: `https://google.com/search?q=${query}`,
          youtube: `https://youtube.com/results?search_query=${query}`,
          github: `https://github.com/search?q=${query}`,
          reddit: `https://reddit.com/search?q=${query}`,
        };
        const url = urls[platform];
        if (url) {
          window.open(url, '_blank');
          return { success: true, message: `✓ Pesquisando no ${platform}...` };
        }
      }
      return { success: false, message: '⚠️ Plataforma não reconhecida' };
    },
  },
  // PARAR FALA
  {
    type: 'custom',
    pattern: /\b(?:parou|para|parada|pausar|pausa|stop|muda de assunto|cala boca|silêncio)\b/i,
    label: 'Pausando áudio',
    execute: async () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
      return { success: true, message: `🔇 Áudio pausado` };
    },
  },
  // CALCULADORA RÁPIDA
  {
    type: 'custom',
    pattern: /\b(\d+)\s*([+\-*\/])\s*(\d+)\b/i,
    label: 'Calculando',
    execute: async (match) => {
      if (match && match[1] && match[2] && match[3]) {
        try {
          const a = parseFloat(match[1]);
          const op = match[2];
          const b = parseFloat(match[3]);
          let result = 0;
          switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = b !== 0 ? a / b : 0; break;
          }
          return { success: true, message: `🧮 ${a} ${op} ${b} = ${result}` };
        } catch {
          return { success: false, message: '⚠️ Erro no cálculo' };
        }
      }
      return { success: false, message: '⚠️ Operação inválida' };
    },
  },
  // TOCAR MÚSICA
  {
    type: 'custom',
    pattern: /\b(?:toca|coloca|reproduz|play|coloque|reproduza|toque)\b\s+(?:a\s+)?(?:música\s+)?(.+?)(?:\s+(?:no\s+)?spotify|no\s+youtube|no\s+yt)?$/i,
    label: 'Tocando música',
    execute: async (match) => {
      if (match && match[1]) {
        const musicName = match[1].trim();
        const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(musicName)}/tracks?si=`;
        const youtubeUrl = `https://music.youtube.com/search?q=${encodeURIComponent(musicName)}`;
        
        window.open(spotifyUrl, '_blank');
        return { success: true, message: `🎵 Tocando: ${musicName}` };
      }
      return { success: false, message: '⚠️ Qual música?' };
    },
  },
  // DETECÇÃO DE MÚSICA POR NOME (sem comando "toca")
  {
    type: 'custom',
    pattern: /^(?:eu sou um cordeirinho|despacito|bohemian rhapsody|imagine|blinding lights|levitating|good as hell|somebody to love|hey jude|let it be|don't stop me now|stairway to heaven|hotel california|sweet child of mine|enter sandman|smells like teen spirit|creep|wonderwall|fake plastic trees|beautiful day|viva la vida|fix you|yellow|in my life|strawberry fields forever|a day in the life|come together|twist and shout)$/i,
    label: 'Tocando música',
    execute: async (match) => {
      if (match) {
        const musicName = match[0].trim();
        const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(musicName)}/tracks?si=`;
        
        window.open(spotifyUrl, '_blank');
        return { success: true, message: `🎵 Tocando: ${musicName}` };
      }
      return { success: false, message: '⚠️ Música não reconhecida' };
    },
  },
  // PLAYLIST
  {
    type: 'custom',
    pattern: /\b(?:toca|coloca|reproduz|abre)\b\s+(?:a\s+)?(?:playlist|album)\s+(?:")?(.+?)(?:")?(?:\s+(?:em|no)\s+(?:spotify|youtube|yt))?$/i,
    label: 'Abrindo playlist',
    execute: async (match) => {
      if (match && match[1]) {
        const playlistName = match[1].trim();
        const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(playlistName)}/playlists`;
        
        window.open(spotifyUrl, '_blank');
        return { success: true, message: `📻 Abrindo playlist: ${playlistName}` };
      }
      return { success: false, message: '⚠️ Qual playlist?' };
    },
  },
];

// Lista de ações simples de URL
const ACTIONS = [
  { pattern: /\b(youtube|yt)\b/i, url: 'https://youtube.com', label: 'YouTube 🎬' },
  { pattern: /\bgoogle\b/i, url: 'https://google.com', label: 'Google 🔍' },
  { pattern: /\bgmail\b/i, url: 'https://mail.google.com', label: 'Gmail 📧' },
  { pattern: /\bwhatsapp\b/i, url: 'https://web.whatsapp.com', label: 'WhatsApp 💬' },
  { pattern: /\binstagram\b/i, url: 'https://instagram.com', label: 'Instagram 📸' },
  { pattern: /\btwitter|x\.com\b/i, url: 'https://x.com', label: 'X (Twitter) 🐦' },
  { pattern: /\bspotify\b/i, url: 'https://open.spotify.com', label: 'Spotify 🎵' },
  { pattern: /\bnetflix\b/i, url: 'https://netflix.com', label: 'Netflix 🎥' },
  { pattern: /\bgithub\b/i, url: 'https://github.com', label: 'GitHub 💻' },
  { pattern: /\blinkedin\b/i, url: 'https://linkedin.com', label: 'LinkedIn 💼' },
  { pattern: /\btelegram\b/i, url: 'https://web.telegram.org', label: 'Telegram ✈️' },
  { pattern: /\breddit\b/i, url: 'https://reddit.com', label: 'Reddit 🤖' },
  { pattern: /\btwitch\b/i, url: 'https://twitch.tv', label: 'Twitch 🎮' },
  { pattern: /\bdiscord\b/i, url: 'https://discord.com/app', label: 'Discord 🎙️' },
  { pattern: /\bchatgpt\b/i, url: 'https://chat.openai.com', label: 'ChatGPT 🤖' },
  { pattern: /\bshoppe?e\b/i, url: 'https://shopee.com.br', label: 'Shopee 🛍️' },
  { pattern: /\bamazon\b/i, url: 'https://amazon.com.br', label: 'Amazon 📦' },
  { pattern: /\bmercado\s*livre\b/i, url: 'https://mercadolivre.com.br', label: 'Mercado Livre 🛒' },
  { pattern: /\bnubank\b/i, url: 'https://nubank.com.br', label: 'Nubank 💜' },
  { pattern: /\bifood\b/i, url: 'https://ifood.com.br', label: 'iFood 🍔' },
];

async function detectAction(content: string): Promise<{ type: ActionType; action: any; label: string } | null> {
  const lower = content.toLowerCase();

  // Verifica ações avançadas primeiro
  for (const action of ADVANCED_ACTIONS) {
    const match = lower.match(action.pattern);
    if (match) {
      const result = await action.execute(match);
      if (result.success) {
        return { type: action.type, action: result.message, label: action.label };
      }
    }
  }

  // Depois verifica URLs simples
  const intent = /\b(abr[ia]r?|abre|open|acessa|vai|vá|entra|mostra|pesquisa|busca|procura|search|procure|buscar|pesquise)\b/i;
  const hasActionIntent = intent.test(lower);

  const directAction = ACTIONS.find((action) => action.pattern.test(lower));
  if (directAction) {
    const cleaned = lower
      .replace(directAction.pattern, '')
      .replace(intent, '')
      .replace(/\b(o|a|para|no|na|em|para o|para a|por favor)\b/g, '')
      .trim();
    const isShortCommand = cleaned.length === 0 || cleaned.split(/\s+/).length <= 2;
    if (hasActionIntent || isShortCommand) {
      return { type: 'url', action: directAction.url, label: directAction.label };
    }
  }

  if (!hasActionIntent) return null;

  for (const action of ACTIONS) {
    if (action.pattern.test(lower)) {
      return { type: 'url', action: action.url, label: action.label };
    }
  }

  const searchMatch = lower.match(/\b(?:pesquisa|busca|search|procura|googla|busque|pesquise)\b\s+(.+)/i);
  if (searchMatch) {
    const query = encodeURIComponent(searchMatch[1].trim());
    return { type: 'search', action: `https://google.com/search?q=${query}`, label: `Pesquisando: "${searchMatch[1].trim()}" 🔍` };
  }

  const ytSearchMatch = lower.match(/\b(?:pesquisa|busca|procura|search|procure|pesquise)\b\s+(.+)\s+no\s+(?:youtube|yt)\b/i)
    || lower.match(/\b(?:no\s+)?(?:youtube|yt)\b\s+(.+)$/i);
  if (ytSearchMatch) {
    const query = encodeURIComponent(ytSearchMatch[1].trim());
    return { type: 'search', action: `https://youtube.com/results?search_query=${query}`, label: `Pesquisando no YouTube 🎬` };
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
        content: `${actionResult.label}\n\n${
          typeof actionResult.action === 'string' ? 
          (actionResult.action.startsWith('http') ? `Abrindo...` : actionResult.action) : 
          JSON.stringify(actionResult.action)
        }`,
        createdAt: new Date().toISOString(),
      };

      set((s) => ({
        messages: [...s.messages, userMessage, assistantMessage],
        status: 'idle',
        routingReason: null,
      }));

      if (typeof window !== 'undefined' && actionResult.type === 'url' && typeof actionResult.action === 'string') {
        const opened = window.open(actionResult.action, '_blank');
        if (!opened) {
          window.location.href = actionResult.action;
        }
      }
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