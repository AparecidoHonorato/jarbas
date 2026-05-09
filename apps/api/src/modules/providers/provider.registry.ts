import { Injectable, OnModuleInit } from '@nestjs/common';
import { AIProvider } from './provider.interface';
import { OpenAIProvider } from './openai/openai.provider';
import { AnthropicProvider } from './anthropic/anthropic.provider';
import { GeminiProvider } from './gemini/gemini.provider';
import { GroqProvider } from './groq/groq.provider';
import type { ProviderName } from '@jarbas/types';

@Injectable()
export class ProviderRegistry implements OnModuleInit {
  private providers = new Map<string, AIProvider>();

  constructor(
    private readonly openai: OpenAIProvider,
    private readonly anthropic: AnthropicProvider,
    private readonly gemini: GeminiProvider,
    private readonly groq: GroqProvider,
  ) {}

  onModuleInit() {
    this.register(this.openai);
    this.register(this.anthropic);
    this.register(this.gemini);
    this.register(this.groq);
  }

  private register(provider: AIProvider) {
    this.providers.set(provider.name, provider);
  }

  get(name: string): AIProvider | undefined {
    const provider = this.providers.get(name);
    if (provider && provider.isAvailable()) return provider;
    return undefined;
  }

  getAvailable(): AIProvider[] {
    return Array.from(this.providers.values()).filter((p) => p.isAvailable());
  }
}