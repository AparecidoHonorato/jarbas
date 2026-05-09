import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AIProvider } from '../provider.interface';
import type { ProviderCapability } from '@jarbas/types';

@Injectable()
export class OpenAIProvider implements AIProvider {
  readonly name = 'openai' as const;
  private client: OpenAI | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  isAvailable(): boolean {
    return this.client !== null;
  }

  getCapabilities(): ProviderCapability {
    return {
      streaming: true,
      vision: true,
      tools: true,
      structuredOutput: true,
      maxContextTokens: 128000,
    };
  }

  async *streamText(message: string, model: string = 'gpt-4o'): AsyncGenerator<string> {
    if (!this.client) throw new Error('OpenAI not configured');

    const systemPrompt = `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.`;

    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  async generateText(message: string, model: string = 'gpt-4o'): Promise<string> {
    if (!this.client) throw new Error('OpenAI not configured');

    const systemPrompt = `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.`;

    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    return response.choices[0]?.message?.content || '';
  }
}
