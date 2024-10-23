import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import * as process from "node:process";
import {UsersService} from "../users/users.service";
import {ExceptionMessage} from "../utils/exception-message.enum";
import { EmailRepository } from './email-repository.abstract';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService extends EmailRepository {
    
    constructor(
        private readonly mailerService: MailerService,
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    async sendMessageToOwners(email: string, message: string) {
        try {
            await this.mailerService.sendMail({
                from: email,
                to: process.env.MAIL_USER,
                subject: message,
            })
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
    
    async sendVerificationCodeByEmail(email: string): Promise<any> {
        try {
            const user = await this.userService.getUserByEmail(email)
            if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const sendingResult = await this.mailerService.sendMail({
                from: this.configService.get<string>("MAIL_SENDER"),
                to: email,
                subject: `Your verification code is: ${verificationCode}`
            })

            return sendingResult;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
