// === Chat Types ===
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  provider?: string;
  model?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
  provider?: string;
  model?: string;
}

export interface ChatStreamEvent {
  type: 'token' | 'done' | 'error' | 'metadata';
  data: string;
  metadata?: {
    provider: string;
    model: string;
    routingReason?: string;
  };
}

// === Provider Types ===
export type ProviderName = 'openai' | 'anthropic' | 'gemini' | 'groq';

export interface ProviderConfig {
  name: ProviderName;
  enabled: boolean;
  apiKey?: string;
  models: string[];
  defaultModel: string;
}

export interface ProviderCapability {
  streaming: boolean;
  vision: boolean;
  tools: boolean;
  structuredOutput: boolean;
  maxContextTokens: number;
}

// === Routing Types ===
export interface RoutingDecision {
  provider: ProviderName;
  model: string;
  reason: string;
  confidence: number;
  fallback?: { provider: ProviderName; model: string };
}

export type TaskCategory =
  | 'general_chat'
  | 'coding'
  | 'summarization'
  | 'structured_extraction'
  | 'multimodal'
  | 'quick_command'
  | 'voice_realtime';

// === Voice Types ===
export interface VoiceState {
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
  transcript?: string;
}

// === Session Types ===
export interface Session {
  id: string;
  conversations: string[];
  createdAt: string;
}
