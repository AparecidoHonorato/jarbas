import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './modules/chat/chat.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { RoutingModule } from './modules/routing/routing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    ProvidersModule,
    RoutingModule,
  ],
})
export class AppModule {}
