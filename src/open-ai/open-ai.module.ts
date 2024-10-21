import { forwardRef, Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import {UsersModule} from "../users/users.module";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ChatManagerModule } from '../chat-manager/chat-manager.module';

@Module({
  providers: [OpenAiService],
  controllers: [OpenAiController],
  imports: [
      JwtModule,
      UsersModule,
      forwardRef(() => ChatManagerModule),
      ConfigModule
  ],
  exports: [OpenAiService]
})
export class OpenAiModule {}
