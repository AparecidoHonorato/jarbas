# JARBAS - AI Assistant

Assistente de IA multi-modelo com interface futurista estilo HUD/JARVIS.

## Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind CSS + Framer Motion
- **Backend:** NestJS + Fastify + TypeScript
- **Providers:** OpenAI GPT, Anthropic Claude, Google Gemini
- **Roteamento:** Classificação automática de tarefa + policy engine

## Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
# Preencha as API keys no .env
```

## Desenvolvimento

```bash
pnpm dev          # Inicia frontend (3000) e API (4000)
pnpm build        # Build de produção
pnpm type-check   # Verificação de tipos
```

## Estrutura

```
apps/
  web/       → Frontend Next.js (UI HUD sci-fi)
  api/       → Backend NestJS (orquestração, providers, routing)
packages/
  types/     → Tipos compartilhados
  tsconfig/  → Configs TypeScript base
```

## Providers

Configure as chaves em `apps/api/.env`:

- `OPENAI_API_KEY` → GPT-4o
- `ANTHROPIC_API_KEY` → Claude
- `GEMINI_API_KEY` → Gemini

O roteador escolhe automaticamente o melhor modelo por tipo de tarefa.
Sem nenhuma chave configurada, o frontend usa um mock local para desenvolvimento.
