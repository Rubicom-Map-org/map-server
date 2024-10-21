import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {RegisterDto} from "./dto/register.dto";
import {TokensService} from "../tokens/tokens.service";
import {User} from "../users/users.entity";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from "bcrypt"
import {ChangePasswordDto} from "./dto/change-password.dto";
import {ExceptionMessage} from "../utils/exception-message.enum";
import {AuthorizationResponseDto} from "./dto/authorization-response.dto";
import { AuthRepository } from './auth-repository.abstract';

@Injectable()
export class AuthService extends AuthRepository {

    constructor(
        private readonly usersService: UsersService,
        private readonly tokensService: TokensService
    ) {
        super();
    }

    async registration(registerDto: RegisterDto): Promise<AuthorizationResponseDto> {
        const hashedPassword = await bcrypt.hash(registerDto.password, 6);
        const registeredUser = await this.usersService.createUser({
            ...registerDto,
            password: hashedPassword,
        });

        const generatedToken = await this.tokensService.generateToken(registeredUser);
        generatedToken.user = registeredUser;
        await this.tokensService.saveToken(generatedToken);

        return { token: generatedToken.token, user: registeredUser }
    }

    private async validateUser(loginDto: LoginDto): Promise<User> {
        const user = await this.usersService.getUserByEmail(loginDto.email)
        if (!user) {
            throw new BadRequestException(ExceptionMessage.USER_NOT_FOUND)
        }
            
        const comparePassword = await bcrypt.compare(loginDto.password, user.password)
        if (user && comparePassword) {
            return user
        }

        throw new BadRequestException(ExceptionMessage.PASSWORDS_DONT_MATCH);
    }

    async login(loginDto: LoginDto): Promise<AuthorizationResponseDto> {
        const user = await this.validateUser(loginDto);
        const generatedToken = await this.tokensService.updateToken(user);
        return { token: generatedToken.token, user: user };
    }

    async deleteAccount(userId: string): Promise<void> {
        const user = await this.usersService.getUserById(userId);
        if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);

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
        console.log(changePasswordDto.password);
            
        return user;
    }
}
