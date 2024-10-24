import {Injectable} from '@nestjs/common';
import { EmailRepository } from '../email-repository.abstract';
import { ConfigService } from '@nestjs/config';
import { SendgridClientService } from './send-grid.service';
import { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class EmailService extends EmailRepository {
    
    constructor(
        private readonly configService: ConfigService,
        private readonly sendgridClientService: SendgridClientService
    ) {
        super();
    }

    async sendVerificationCodeByEmail(email: string, verificationCode: string): Promise<void> {
        const mail: MailDataRequired = {
            to: email,
            from: this.configService.get<string>("EMAIL_SENDER"),
            subject: "Code verification",
            text: `Your verification code: ${verificationCode}`
        };
        await this.sendgridClientService.sendEmail(mail);
    }
}
