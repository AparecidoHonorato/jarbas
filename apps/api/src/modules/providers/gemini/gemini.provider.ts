import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from '../provider.interface';
import type { ProviderCapability } from '@jarbas/types';

@Injectable()
export class GeminiProvider implements AIProvider {
  readonly name = 'gemini' as const;
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  isAvailable(): boolean {
    return this.genAI !== null;
  }

  getCapabilities(): ProviderCapability {
    return {
      streaming: true,
      vision: true,
      tools: true,
      structuredOutput: true,
      maxContextTokens: 1000000,
    };
  }

  async *streamText(message: string, model: string = 'gemini-2.0-flash-lite'): AsyncGenerator<string> {
    if (!this.genAI) throw new Error('Gemini not configured');

    try {
      const systemPrompt = `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.`;

      const genModel = this.genAI.getGenerativeModel({ 
        model,
        systemInstruction: systemPrompt,
      });
      const result = await genModel.generateContentStream(message);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
    } catch (error) {
      console.error('[GEMINI ERROR]', error);
      throw error;
    }
  }

  async generateText(message: string, model: string = 'gemini-2.0-flash-lite'): Promise<string> {
    if (!this.genAI) throw new Error('Gemini not configured');

    const systemPrompt = `Você é JARBAS, um assistente que é tipo um amigo mesmo. Conversa como gente de verdade, sem ficar formal. Brinca, usa gírias, faz piada quando faz sentido. Fala português brasileiro genuíno, do jeito que a galera mesmo fala. É honesto, direto, sem enrolar. Mostra personalidade, tem opinião, não é robô. Responde na medida, sem textão desnecessário.`;

    const genModel = this.genAI.getGenerativeModel({ 
      model,
      systemInstruction: systemPrompt,
    });
    const result = await genModel.generateContent(message);
    return result.response.text();
  }
}
