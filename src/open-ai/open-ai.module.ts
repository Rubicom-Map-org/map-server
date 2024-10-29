import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ChatManagerModule } from '../chat-manager/chat-manager.module';

@Module({
  providers: [OpenAiService],
  controllers: [OpenAiController],
  imports: [
      JwtModule,
      ConfigModule,
      ChatManagerModule
  ],
  exports: [OpenAiService]
})
export class OpenAiModule {}
