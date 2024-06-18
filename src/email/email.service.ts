import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import * as process from "node:process";

@Injectable()
export class EmailService {

    constructor(private readonly mailerService: MailerService) {
    }

    async sendMessageToOwners(email: string, message: string) {

        await this.mailerService.sendMail({
            from: email,
            to: process.env.MAIL_USER,
            subject: message,
        })

    }

}
