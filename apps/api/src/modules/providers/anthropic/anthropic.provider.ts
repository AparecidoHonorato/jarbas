import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { AIProvider } from '../provider.interface';
import type { ProviderCapability } from '@jarbas/types';

@Injectable()
export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic' as const;
  private client: Anthropic | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      this.client = new Anthropic({ apiKey });
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
      maxContextTokens: 200000,
    };
  }

  async *streamText(message: string, model: string = 'claude-sonnet-4-20250514'): AsyncGenerator<string> {
    if (!this.client) throw new Error('Anthropic not configured');

    const systemPrompt = `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.`;

    const stream = await this.client.messages.stream({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }

  async generateText(message: string, model: string = 'claude-sonnet-4-20250514'): Promise<string> {
    if (!this.client) throw new Error('Anthropic not configured');

    const systemPrompt = `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.`;

    const response = await this.client.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const block = response.content[0];
    return block.type === 'text' ? block.text : '';
  }
}
