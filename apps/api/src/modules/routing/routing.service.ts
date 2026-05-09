import { Injectable } from '@nestjs/common';
import { ProviderRegistry } from '../providers/provider.registry';
import type { RoutingDecision, TaskCategory } from '@jarbas/types';

interface RoutingPolicy {
  taskCategory: TaskCategory;
  preferred: { provider: string; model: string };
  fallback: { provider: string; model: string };
}

const DEFAULT_POLICIES: RoutingPolicy[] = [
  {
    taskCategory: 'coding',
    preferred: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
    fallback: { provider: 'groq', model: 'llama-3.3-70b-versatile' },
  },
  {
    taskCategory: 'general_chat',
    preferred: { provider: 'groq', model: 'llama-3.3-70b-versatile' },
    fallback: { provider: 'openai', model: 'gpt-4o' },
  },
  {
    taskCategory: 'quick_command',
    preferred: { provider: 'groq', model: 'llama-3.3-70b-versatile' },
    fallback: { provider: 'openai', model: 'gpt-4o' },
  },
  {
    taskCategory: 'summarization',
    preferred: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
    fallback: { provider: 'groq', model: 'llama-3.3-70b-versatile' },
  },
  {
    taskCategory: 'structured_extraction',
    preferred: { provider: 'groq', model: 'llama-3.3-70b-versatile' },
    fallback: { provider: 'openai', model: 'gpt-4o' },
  },
  {
    taskCategory: 'multimodal',
    preferred: { provider: 'groq', model: 'llama-3.3-70b-versatile' },
    fallback: { provider: 'openai', model: 'gpt-4o' },
  },
];

@Injectable()
export class RoutingService {
  constructor(private readonly providers: ProviderRegistry) {}

  route(message: string, preferredProvider?: string, preferredModel?: string): RoutingDecision {
    if (preferredProvider) {
      return {
        provider: preferredProvider as any,
        model: preferredModel || this.getDefaultModel(preferredProvider),
        reason: 'user_override',
        confidence: 1.0,
      };
    }

    const category = this.classifyTask(message);
    const policy = DEFAULT_POLICIES.find((p) => p.taskCategory === category)
      || DEFAULT_POLICIES.find((p) => p.taskCategory === 'general_chat')!;

    const primaryAvailable = this.providers.get(policy.preferred.provider);
    const fallbackAvailable = this.providers.get(policy.fallback.provider);

    if (primaryAvailable) {
      return {
        provider: policy.preferred.provider as any,
        model: policy.preferred.model,
        reason: `best_for_${category}`,
        confidence: 0.8,
        fallback: policy.fallback as any,
      };
    }

    if (fallbackAvailable) {
      return {
        provider: policy.fallback.provider as any,
        model: policy.fallback.model,
        reason: 'fallback_primary_unavailable',
        confidence: 0.6,
      };
    }

    const available = this.providers.getAvailable();
    if (available.length > 0) {
      return {
        provider: available[0].name as any,
        model: this.getDefaultModel(available[0].name),
        reason: 'last_available',
        confidence: 0.4,
      };
    }

    return {
      provider: 'groq' as any,
      model: 'llama-3.3-70b-versatile',
      reason: 'no_provider_available',
      confidence: 0,
    };
  }

  private classifyTask(message: string): TaskCategory {
    const lower = message.toLowerCase();

    if (/\b(code|código|function|função|bug|error|erro|typescript|python|javascript|react|api|sql|regex)\b/i.test(lower)) {
      return 'coding';
    }
    if (/\b(resuma|resumo|summarize|summary|sintetize|tldr)\b/i.test(lower)) {
      return 'summarization';
    }
    if (/\b(json|extract|extraia|parse|structured|schema)\b/i.test(lower)) {
      return 'structured_extraction';
    }
    if (/\b(image|imagem|foto|picture|visual)\b/i.test(lower)) {
      return 'multimodal';
    }
    if (lower.length < 30) {
      return 'quick_command';
    }

    return 'general_chat';
  }

  private getDefaultModel(provider: string): string {
    switch (provider) {
      case 'openai': return 'gpt-4o';
      case 'anthropic': return 'claude-sonnet-4-20250514';
      case 'groq': return 'llama-3.3-70b-versatile';
      default: return 'llama-3.3-70b-versatile';
    }
  }
}