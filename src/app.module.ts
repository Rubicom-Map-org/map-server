import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { User } from "./users/users.entity";
import { TokensService } from './tokens/tokens.service';
import { TokensModule } from './tokens/tokens.module';
import { JwtTokenMiddleware } from "./middlewares/jwt-token.middleware";
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { Token } from "./tokens/tokens.entity";
import {dataSourceOptions} from "./database/data-source";
import * as dotenv from "dotenv"
import * as process from "node:process";
dotenv.config({path: `.${process.env.NODE_ENV}.env`})

@Module({
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, TokensService],
  imports: [
      ConfigModule.forRoot({
        envFilePath: `.${process.env.NODE_ENV}.env`
      }),
      TypeOrmModule.forRoot(dataSourceOptions),
      UsersModule,
      AuthModule,
      TokensModule,
      GoogleAuthModule
  ],
    exports: [
        TypeOrmModule
    ]
})
export class AppModule {}
