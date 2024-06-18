import {Controller, HttpException, HttpStatus, Post, Req, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {EmailService} from "./email.service";
import {AuthGuard} from "../auth/auth.guard";

@Controller('email')
export class EmailController {

    constructor(private readonly emailService: EmailService) {
    }

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post("/send-email")
    async sendEmail(@Req() request, message: string) {
        try {
            const email = request.user.email
            return this.emailService.sendMessageToOwners(email, message)
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
