import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {EmailService} from "./email.service";
import {AuthGuard} from "../auth/auth.guard";
import {UserId} from "../decorators/user-id.decorator";
import {UserEmail} from "../decorators/user-email.decorator";

@UseGuards(AuthGuard)
@Controller('email')
export class EmailController {

    constructor(private readonly emailService: EmailService) {}

    @UsePipes(ValidationPipe)
    @Post("/send-email")
    async sendEmail(@UserEmail() email: string, @Body() message: string) {
        try {
            return this.emailService.sendMessageToOwners(email, message)
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Post("verify-email")
    async sendVerificationCode(@UserEmail() userEmail: string) {
        try {
            return this.emailService.sendVerificationCodeByEmail(userEmail)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    

}
