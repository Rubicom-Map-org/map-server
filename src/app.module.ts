import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TokensService } from './tokens/tokens.service';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import {dataSourceOptions} from "./database/data-source";
import { EmailModule } from './email/email.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { SavedPlacesModule } from './saved-places/saved-places.module';
import * as dotenv from "dotenv";
import * as process from "node:process";
import {OpenAiService} from "./open-ai/open-ai.service";
import {OpenAiController} from "./open-ai/open-ai.controller";
import { TokensModule } from './tokens/tokens.module';
import {JwtModule, JwtService} from "@nestjs/jwt";
import {SavedPlacesService} from "./saved-places/saved-places.service";
import {SavedPlacesController} from "./saved-places/saved-places.controller";
import { ChatManagerModule } from './chat-manager/chat-manager.module';
import { FilesModule } from './files/files.module';
import {MulterModule} from "@nestjs/platform-express";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "node:path";
import {LastVisitedPlacesModule} from "./last-visited-places/last-visited-places.module";
dotenv.config()

@Module({
  controllers: [UsersController, AuthController, OpenAiController, SavedPlacesController],
  providers: [
      UsersService,
      AuthService,
      TokensService,
      OpenAiService,
      SavedPlacesService,
  ],
  imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      TypeOrmModule.forRoot(dataSourceOptions),
      JwtModule.register({
          secret: process.env.JWT_SECRET_KEY || "secret",
          signOptions: {
              expiresIn: "336h"
          }
      }),
      ServeStaticModule.forRoot({
          rootPath: path.join(__dirname, "..", "uploads")
      }),
      UsersModule,
      AuthModule,
      GoogleAuthModule,
      EmailModule,
      OpenAiModule,
      SavedPlacesModule,
      TokensModule,
      ChatManagerModule,
      FilesModule,
      LastVisitedPlacesModule,
      MulterModule.register({ dest: "./uploads" })
  ],
    exports: [
        TypeOrmModule,
        JwtModule
    ]
})
export class AppModule {}
