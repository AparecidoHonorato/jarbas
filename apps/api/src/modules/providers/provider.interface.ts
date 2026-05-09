import type { ProviderCapability } from '@jarbas/types';

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  getCapabilities(): ProviderCapability;
  streamText(message: string, model: string, history?: Array<{ role: string; content: string }>): AsyncGenerator<string>;
  generateText(message: string, model: string, history?: Array<{ role: string; content: string }>): Promise<string>;
}