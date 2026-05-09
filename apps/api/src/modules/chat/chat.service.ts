import { Injectable } from '@nestjs/common';
import { RoutingService } from '../routing/routing.service';
import { ProviderRegistry } from '../providers/provider.registry';
import type { ChatStreamEvent } from '@jarbas/types';

@Injectable()
export class ChatService {
  constructor(
    private readonly routing: RoutingService,
    private readonly providers: ProviderRegistry,
  ) {}

  async *streamChat(
    message: string,
    preferredProvider?: string,
    preferredModel?: string,
    history: Array<{ role: string; content: string }> = [],
  ): AsyncGenerator<ChatStreamEvent> {
    const decision = this.routing.route(message, preferredProvider, preferredModel);

    yield {
      type: 'metadata',
      data: '',
      metadata: {
        provider: decision.provider,
        model: decision.model,
        routingReason: decision.reason,
      },
    };

    const provider = this.providers.get(decision.provider);

    if (!provider) {
      yield { type: 'error', data: `Provider ${decision.provider} not available` };
      return;
    }

    try {
      const stream = provider.streamText(message, decision.model, history);
      for await (const token of stream) {
        yield { type: 'token', data: token };
      }
      yield { type: 'done', data: '' };
    } catch (error) {
      if (decision.fallback) {
        const fallbackProvider = this.providers.get(decision.fallback.provider);
        if (fallbackProvider) {
          yield {
            type: 'metadata',
            data: '',
            metadata: {
              provider: decision.fallback.provider,
              model: decision.fallback.model,
              routingReason: 'fallback after primary failure',
            },
          };

          const fallbackStream = fallbackProvider.streamText(
            message,
            decision.fallback.model,
            history,
          );
          for await (const token of fallbackStream) {
            yield { type: 'token', data: token };
          }
          yield { type: 'done', data: '' };
          return;
        }
      }
      yield { type: 'error', data: 'All providers failed' };
    }
  }
}