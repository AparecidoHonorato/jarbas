import { Controller, Post, Body, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    @Body() body: {
      message: string;
      provider?: string;
      model?: string;
      history?: Array<{ role: string; content: string }>;
    },
    @Res() reply: FastifyReply,
  ) {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    try {
      const stream = this.chatService.streamChat(
        body.message,
        body.provider,
        body.model,
        body.history || [],
      );

      for await (const event of stream) {
        if (reply.raw.writableEnded) break;
        reply.raw.write(`data: ${JSON.stringify(event)}\n\n`);
      }
    } catch (error) {
      if (!reply.raw.writableEnded) {
        reply.raw.write(`data: ${JSON.stringify({ type: 'error', data: 'Erro interno do servidor' })}\n\n`);
      }
    } finally {
      if (!reply.raw.writableEnded) {
        reply.raw.write('data: [DONE]\n\n');
        reply.raw.end();
      }
    }
  }
}