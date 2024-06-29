import {forwardRef, Module} from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {ChatManagerModule} from "../chat-manager/chat-manager.module";

@Module({
  providers: [OpenAiService],
  controllers: [OpenAiController],
  imports: [
      AuthModule,
      UsersModule,
      forwardRef(() => ChatManagerModule)
  ],
  exports: [OpenAiService]
})
export class OpenAiModule {}
