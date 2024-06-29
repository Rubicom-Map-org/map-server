import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import {MailerModule} from "@nestjs-modules/mailer";
import { EmailController } from './email.controller';
import * as dotenv from "dotenv"
import * as process from "node:process";
import {JwtModule} from "@nestjs/jwt";

@Module({
  providers: [EmailService],
  imports: [
      MailerModule.forRoot({
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          secure: Boolean(process.env.MAIL_SECURE),
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
        options: {
          strict: Boolean(process.env.MAIL_OPTIONS_STRICT)
        }
      }),
      JwtModule
  ],
  exports: [EmailService],
  controllers: [EmailController]
})
export class EmailModule {}
