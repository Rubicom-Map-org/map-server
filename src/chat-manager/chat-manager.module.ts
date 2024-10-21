import {forwardRef, Module} from '@nestjs/common';
import { ChatManagerService } from './chat-manager.service';
import { ChatManagerController } from './chat-manager.controller';
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chat} from "./enitities/chat.entity";
import {ChatRequest} from "./enitities/chat-request.entity";
import {OpenAiModule} from "../open-ai/open-ai.module";
import process from "node:process";
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ChatManagerService],
  controllers: [ChatManagerController],
  imports: [
      JwtModule,
      UsersModule,
      TypeOrmModule.forFeature([Chat, ChatRequest]),
      forwardRef(() => OpenAiModule),
  ],
  exports: [
      TypeOrmModule,
      ChatManagerService
  ]
})
export class ChatManagerModule {}
