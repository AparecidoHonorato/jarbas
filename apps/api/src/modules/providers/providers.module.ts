import { Module, Global } from '@nestjs/common';
import { ProviderRegistry } from './provider.registry';
import { OpenAIProvider } from './openai/openai.provider';
import { AnthropicProvider } from './anthropic/anthropic.provider';
import { GeminiProvider } from './gemini/gemini.provider';
import { GroqProvider } from './groq/groq.provider';

@Global()
@Module({
  providers: [ProviderRegistry, OpenAIProvider, AnthropicProvider, GeminiProvider, GroqProvider],
  exports: [ProviderRegistry],
})
export class ProvidersModule {}