import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { AIProvider } from '../provider.interface';
import type { ProviderCapability } from '@jarbas/types';

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

  async *streamText(message: string, model: string = 'llama-3.3-70b-versatile'): AsyncGenerator<string> {
    if (!this.client) throw new Error('Groq not configured');

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.` },
          { role: 'user', content: message }
        ],
        stream: true,
        max_tokens: 4096,
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

  async generateText(message: string, model: string = 'llama-3.3-70b-versatile'): Promise<string> {
    if (!this.client) throw new Error('Groq not configured');

    const response = await this.client.chat.completions.create({
      model,
      messages: [
          { role: 'system', content: `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.` },
        { role: 'user', content: message }
      ],
      max_tokens: 4096,
    });

    return response.choices[0]?.message?.content || '';
  }
}