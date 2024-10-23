import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import {MailerModule} from "@nestjs-modules/mailer";
import { EmailController } from './email.controller';
import * as dotenv from "dotenv"
import * as process from "node:process";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {AuthModule} from "../auth/auth.module";
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [EmailService],
  imports: [
      ConfigModule,
      MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
              transport: {
                  host: configService.get<string>("MAIL_HOST"),
                  port: configService.get<number>("MAIL_PORT"),
                  secure: false,
                  auth: {
                     user: configService.get<string>("MAIL_USER"),
                      pass: configService.get<string>("MAIL_PASSWORD")
                  },
              },
              defaults: {
                  from: '"No Reply" <noreply@example.com>',
              },
              options: {
                  strict: Boolean(configService.get<string>("MAIL_OPTIONS_STRICT"))
              }
          })
      }),
      UsersModule,
      JwtModule
  ],
  exports: [EmailService],
  controllers: [EmailController]
})
export class EmailModule {}
