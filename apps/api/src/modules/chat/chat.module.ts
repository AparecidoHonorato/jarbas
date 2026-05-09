import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ProvidersModule } from '../providers/providers.module';
import { RoutingModule } from '../routing/routing.module';

@Module({
  imports: [ProvidersModule, RoutingModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
