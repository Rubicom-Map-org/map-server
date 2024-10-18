import {HttpException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import * as process from "node:process";
import {UsersService} from "../users/users.service";
import {ExceptionMessage} from "../utils/exception-message.enum";
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class EmailService {
    
    constructor(
        private readonly mailerService: MailerService,
        private readonly userService: UsersService
    ) {}

    async sendMessageToOwners(email: string, message: string) {
        try {
            await this.mailerService.sendMail({
                from: email,
                to: process.env.MAIL_USER,
                subject: message,
            })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }
    
    async sendVerificationCodeByEmail(email: string): Promise<any> {
        try {
            const user = await this.userService.getUserByEmail(email)
            if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)
            
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const sendingResult = await this.mailerService.sendMail({
                from: process.env.MAIL_SENDER,
                to: email,
                subject: `Your verification code is: ${verificationCode}`
            })
            
            return sendingResult
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

}
