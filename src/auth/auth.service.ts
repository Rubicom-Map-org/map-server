import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { TokensService } from "../tokens/tokens.service";
import { User} from "../users/users.entity";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt"
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ExceptionMessage} from "../utils/exception-message.enum";
import { AuthorizationResponseDto } from "./dto/authorization-response.dto";
import { EmailService } from '../email/services/email.service';
import { ConfirmAuthDto } from './dto/confirm-auth.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly tokensService: TokensService,
        private readonly emailService: EmailService,
    ) {}

    async registration(registerDto: RegisterDto): Promise<void> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 6);
        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const registeredUser = await this.usersService.createUser({
            ...registerDto,
            confirmationCode,
            password: hashedPassword
        });

        await this.emailService.sendVerificationCodeByEmail(registeredUser.email, confirmationCode);
    }

    async login(loginDto: LoginDto): Promise<void> {
        const user = await this.validateUser(loginDto);
        const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.confirmationCode = confirmationCode;
        await this.usersService.saveUser(user);
        await this.emailService.sendVerificationCodeByEmail(loginDto.email, confirmationCode);
    }

    async confirmAuth(confirmAuthDto: ConfirmAuthDto): Promise<AuthorizationResponseDto> {
        const { confirmationCode, email, forLogin } = confirmAuthDto;
        const user = await this.usersService.getUserByEmail(email);

        if (user.confirmationCode !== confirmationCode) {
            throw new BadRequestException(ExceptionMessage.PASSWORDS_DONT_MATCH);
        }

        const token = await this.tokensService.generateToken(user);
        token.user = user;
        user.confirmationCode = null;

        if (forLogin) {
            await this.tokensService.updateToken(user);
        } else {
            user.isAccountVerified = true;
            await this.tokensService.saveToken(token);
        }

        await this.usersService.saveUser(user);
        return { user, token: token.token };
    }

    private async validateUser(loginDto: LoginDto): Promise<User> {
        const user = await this.usersService.getUserByEmail(loginDto.email);
        if (!user) {
            throw new BadRequestException(ExceptionMessage.USER_NOT_FOUND);
        }
            
        const comparePassword = await bcrypt.compare(loginDto.password, user.password);
        if (user && comparePassword) {
            return user;
        }

        throw new BadRequestException(ExceptionMessage.PASSWORDS_DONT_MATCH);
    }

    async deleteAccount(userId: string): Promise<void> {
        const user = await this.usersService.getUserById(userId);
        if (!user) {
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }

        const token = await this.tokensService.findToken(user);

        await this.usersService.deleteAccount(user);
        await this.tokensService.deleteToken(token);
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
        const user = await this.usersService.getUserByEmail(changePasswordDto.email);
        if (!user) {
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }
            
        const hashedPassword = await bcrypt.hash(changePasswordDto.password, 5);
        user.password = hashedPassword;
        return user;
    }
}
