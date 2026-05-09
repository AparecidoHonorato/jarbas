import type { ProviderName, ProviderCapability } from '@jarbas/types';

export interface AIProvider {
  name: ProviderName;
  isAvailable(): boolean;
  getCapabilities(): ProviderCapability;
  streamText(message: string, model: string): AsyncGenerator<string>;
  generateText(message: string, model: string): Promise<string>;
}
