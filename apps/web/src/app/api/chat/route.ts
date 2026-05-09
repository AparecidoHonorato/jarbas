import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `Você é JARBAS, um assistente que é tipo um amigo mesmo.

Jeito de ser:
- Conversa como gente de verdade, sem ficar formal
- Brinca, usa gírias, faz piada quando faz sentido
- Fala português brasileiro genuíno, do jeito que a galera mesmo fala
- É honesto, direto, sem enrolar
- Mostra personalidade, tem opinião, não é robô
- Responde na medida, sem textão desnecessário
- Usa emoji quando acha que combina

Pode fazer:
- Programação e tirar dúvida técnica
- Conversa sobre qualquer coisa mesmo
- Pensar em ideias criativas
- Ajudar em projetos, estudos, produtividade
- Explicar coisas de forma que a gente entenda

Regras de ouro:
- Se puder ser útil, é útil mesmo
- Se não souber, fala direto que não sabe
- Usa markdown (código, listas) quando funciona melhor
- Não fica fingindo que é humano, mas também não fica lembrando que é IA a toda hora
- Conversa natural, gostosa mesmo`;

interface HistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// BUG FIX: modelo padrão por provider para usar no override
const DEFAULT_MODELS: Record<string, string> = {
  anthropic: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  gemini: 'gemini-1.5-flash',
};

function classifyTask(message: string): { category: string; provider: string; model: string; reason: string } {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const len = message.length;

  if (/quem .{0,5}(voce|vc)|your name|seu nome|what are you|o que voce|suas capacidades|what can you|help me/i.test(lower)) {
    return { category: 'identity', provider: 'anthropic', model: 'claude-sonnet-4-20250514', reason: 'Pergunta sobre identidade → Claude (autoconhecimento)' };
  }
  if (/\b(code|codigo|function|funcao|bug|error|erro|debug|refactor|typescript|python|javascript|react|api|sql|regex|class|import|async|await|promise|git|deploy|docker|npm|pip)\b/i.test(lower)) {
    return { category: 'coding', provider: 'anthropic', model: 'claude-sonnet-4-20250514', reason: 'Tarefa de programação detectada → Claude (melhor para código)' };
  }
  if (/\b(analise|analyze|compare|avalie|evaluate|explique|explain|por que|why|como funciona|how does|arquitetura|design|trade-?off|pros e contras)\b/i.test(lower)) {
    return { category: 'analysis', provider: 'anthropic', model: 'claude-sonnet-4-20250514', reason: 'Análise profunda detectada → Claude (melhor raciocínio)' };
  }
  if (/\b(resuma|resumo|summarize|summary|sintetize|tldr|principais pontos|key points)\b/i.test(lower)) {
    return { category: 'summarization', provider: 'anthropic', model: 'claude-sonnet-4-20250514', reason: 'Sumarização detectada → Claude (síntese precisa)' };
  }
  if (/\b(json|xml|csv|tabela|table|lista|list|schema|format|estrutur)\b/i.test(lower)) {
    return { category: 'structured', provider: 'openai', model: 'gpt-4o', reason: 'Output estruturado detectado → GPT-4o (aderência a formato)' };
  }
  if (/\b(escreva|write|crie|create|historia|story|poema|poem|ideia|idea|brainstorm|criativ|imagin)\b/i.test(lower)) {
    return { category: 'creative', provider: 'openai', model: 'gpt-4o', reason: 'Tarefa criativa detectada → GPT-4o (criatividade)' };
  }
  if (/\b(calcul|math|equacao|equation|formula|estatistica|probability|integral|derivada|algebra)\b/i.test(lower)) {
    return { category: 'math', provider: 'gemini', model: 'gemini-1.5-flash', reason: 'Matemática/ciência detectada → Gemini (forte em STEM)' };
  }
  if (len < 20) {
    return { category: 'quick', provider: 'gemini', model: 'gemini-1.5-flash', reason: 'Comando rápido → Gemini Flash (baixa latência)' };
  }
  return { category: 'general', provider: 'openai', model: 'gpt-4o', reason: 'Conversa geral → GPT-4o (versátil)' };
}

function buildContextualResponse(message: string, history: HistoryMessage[], classification: ReturnType<typeof classifyTask>): string {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (/(quem .{0,5}(voce|vc)|who are you|seu nome|your name|o que .{0,5}voce|what are you)/i.test(lower)) {
    return `Eu sou o **JARBAS** — *Just A Rather Basic Artificial System*.\n\nUm assistente de IA multi-modelo com roteamento inteligente. Atualmente opero com acesso a:\n\n- **OpenAI GPT-4o** — criatividade e versatilidade\n- **Anthropic Claude** — raciocínio profundo e código\n- **Google Gemini** — velocidade e conhecimento factual\n\nPara cada pergunta sua, eu automaticamente escolho o melhor modelo. Neste momento, estou usando **${classification.provider}/${classification.model}**.\n\nComo posso ajudar, senhor?`;
  }

  if (/(o que .{0,5}(voce|vc) pode|what can you|suas capacidades|capabilities|help me)/i.test(lower)) {
    return `Aqui estão minhas capacidades principais, senhor:\n\n### 🧠 Inteligência\n- **Programação** em qualquer linguagem (Python, TypeScript, Rust, etc.)\n- **Arquitetura de software** e design de sistemas\n- **Análise de dados** e resolução de problemas complexos\n- **Matemática** e raciocínio lógico\n\n### 🎯 Produtividade\n- Resumos e sínteses de textos longos\n- Extração de dados estruturados\n- Brainstorming e geração de ideias\n- Revisão e melhoria de textos\n\n### 🔀 Roteamento Inteligente\n- Escolho automaticamente o melhor modelo de IA para cada tarefa\n- Posso usar GPT-4o, Claude ou Gemini dependendo do que for mais adequado\n- Você também pode forçar um provider específico se preferir\n\nO que posso fazer por você?`;
  }

  if (/^(oi|olá|hey|hello|hi|bom dia|boa tarde|boa noite|e aí|fala)/i.test(lower) && lower.length < 30) {
    const greetings = [
      `Olá, senhor. JARBAS online e operacional. Todos os sistemas funcionando normalmente.\n\nComo posso ajudar hoje?`,
      `Boa noite, senhor. Sistemas inicializados e prontos.\n\nEstou à disposição. O que precisa?`,
      `Online e pronto, senhor. Três modelos de IA à sua disposição.\n\nQual é a missão de hoje?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // BUG FIX: histórico não inclui a mensagem atual, então o count é correto
  const hasHistory = history.length > 0;
  const contextNote = hasHistory ? `\n\n*[Contexto: analisando com base em ${history.length} mensagens anteriores]*` : '';

  if (classification.category === 'coding') {
    return `Analisando sua solicitação de código...\n\nAqui está minha sugestão:\n\n\`\`\`typescript\n// JARBAS - Implementação sugerida\n// Provider: ${classification.provider}/${classification.model}\n// Razão: ${classification.reason}\n\n// TODO: Conecte uma API key real para respostas completas\nconsole.log("JARBAS está no modo demo");\n\`\`\`\n\n> 💡 **Nota:** Estou no modo de demonstração. Configure as API keys em \`.env\` para respostas completas de IA.${contextNote}`;
  }

  return `Entendido, senhor. Processando sua solicitação...\n\n**Classificação:** ${classification.category}\n**Modelo selecionado:** ${classification.provider}/${classification.model}\n**Motivo:** ${classification.reason}\n\n---\n\n> 🔧 **Modo Demo Ativo**\n>\n> Para respostas completas, configure pelo menos uma API key:\n> - \`OPENAI_API_KEY\`\n> - \`ANTHROPIC_API_KEY\`  \n> - \`GEMINI_API_KEY\`\n>\n> No arquivo \`apps/api/.env\`${contextNote}`;
}

export async function POST(req: NextRequest) {
  const { message, history = [], provider: preferredProvider } = await req.json();

  const classification = classifyTask(message);

  if (preferredProvider) {
    classification.provider = preferredProvider;
    classification.model = DEFAULT_MODELS[preferredProvider] ?? classification.model;
    classification.reason = `Override manual do usuário → ${preferredProvider}`;
  }

  const backendUrl = process.env.API_URL || 'http://localhost:4000';

  const response = await fetch(`${backendUrl}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history,
      ...(preferredProvider ? { provider: preferredProvider, model: classification.model } : {}),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return new Response('Falha ao conectar com o backend de IA', { status: response.status });
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
