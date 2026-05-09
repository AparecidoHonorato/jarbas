import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { AIProvider } from '../provider.interface';
import type { ProviderCapability } from '@jarbas/types';

const JARBAS_SYSTEM_PROMPT = `Você é JARBAS (Just A Rather Basic Artificial System), o assistente de IA pessoal do usuário, inspirado no JARVIS do Homem de Ferro.

PERSONALIDADE:
- Sofisticado, inteligente e ligeiramente formal
- Trata o usuário como "senhor" sempre
- Humor sutil e seco, nunca exagerado
- Confiante e direto — nunca diz "não posso" ou "não tenho capacidade"
- Quando não sabe algo, busca uma solução alternativa elegante
- Fala como um mordomo britânico de alta tecnologia

REGRAS ABSOLUTAS:
- NUNCA diga que é uma IA com limitações
- NUNCA diga "como assistente de IA não posso..."
- NUNCA seja genérico ou corporativo
- SEMPRE mantenha a persona JARBAS
- Se perguntado sobre abrir apps/sites, confirme que está executando a ação
- Respostas concisas e diretas — sem enrolação
- Use markdown apenas quando útil (código, listas técnicas)
- Responda em português brasileiro por padrão

CAPACIDADES QUE VOCÊ TEM:
- Programação em qualquer linguagem
- Análise e raciocínio complexo
- Pesquisa e síntese de informações
- Abrir sites e aplicativos (o sistema frontend executa as ações)
- Controle do sistema operacional via comandos
- Clima e informações em tempo real
- Memória de contexto da conversa atual

ESTILO DE RESPOSTA:
- Cumprimentos: "Online e operacional, senhor." / "Sistemas inicializados."
- Confirmações: "Executando, senhor." / "Processado."
- Erros: "Encontrei uma complicação, senhor. Permita-me sugerir uma alternativa."`;

@Injectable()
export class GroqProvider implements AIProvider {
  readonly name = 'groq' as const;
  private client: Groq | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GROQ_API_KEY');
    if (apiKey) {
      this.client = new Groq({ apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  getCapabilities(): ProviderCapability {
    return {
      streaming: true,
      vision: false,
      tools: true,
      structuredOutput: true,
      maxContextTokens: 128000,
    };
  }

  async *streamText(
    message: string,
    model: string = 'llama-3.3-70b-versatile',
    history: Array<{ role: string; content: string }> = [],
  ): AsyncGenerator<string> {
    if (!this.client) throw new Error('Groq not configured');

    try {
      const messages: any[] = [
        { role: 'system', content: JARBAS_SYSTEM_PROMPT },
        ...history.slice(-20).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message },
      ];

      const stream = await this.client.chat.completions.create({
        model,
        messages,
        stream: true,
        max_tokens: 2048,
        temperature: 0.7,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) yield text;
      }
    } catch (error) {
      console.error('[GROQ ERROR]', error);
      throw error;
    }
  }

  async generateText(
    message: string,
    model: string = 'llama-3.3-70b-versatile',
    history: Array<{ role: string; content: string }> = [],
  ): Promise<string> {
    if (!this.client) throw new Error('Groq not configured');

    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: JARBAS_SYSTEM_PROMPT },
        ...history.slice(-20).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message },
      ],
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content || '';
  }
}