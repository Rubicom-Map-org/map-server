import {
    BadRequestException, HttpException, HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {RegisterDto} from "./dto/register.dto";
import {TokensService} from "../tokens/tokens.service";
import {User} from "../users/users.entity";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from "bcrypt"
import {Token} from "../tokens/tokens.entity";
import {ChangePasswordDto} from "./dto/change-password.dto";
import {ExceptionMessage} from "../utils/exception-message.enum";

export interface AuthorizationResponse {
    token: string,
    user: User
}

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly tokensService: TokensService
    )
    {}

    async registration(registerDto: RegisterDto): Promise<AuthorizationResponse>
    {
        try {
            const userCheckByEmail = await this.usersService.getUserByEmail(registerDto.email)
            const userCheckUsername = await this.usersService.getUserByUsername(registerDto.username)
            
            if (userCheckByEmail) {
                throw new BadRequestException(ExceptionMessage.USER_ALREADY_EXISTS)
            }
            if (userCheckUsername) {
                throw new BadRequestException(ExceptionMessage.USER_ALREADY_EXISTS)
            }
            
            const hashedPassword = await bcrypt.hash(registerDto.password, 6)
            const registeredUser = await this.usersService.createUser({
                ...registerDto,
                password: hashedPassword,
            })
            
            const generatedToken = await this.tokensService.generateToken(registeredUser)
            
            generatedToken.user = registeredUser
            await this.tokensService.saveToken(generatedToken)
            
            return {
                token: generatedToken.token,
                user: registeredUser
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async validateUser(loginDto: LoginDto): Promise<User>
    {
        try {
            const user = await this.usersService.getUserByEmail(loginDto.email)
            
            if (!user) {
                throw new BadRequestException(ExceptionMessage.USER_NOT_FOUND)
            }
            
            const comparePassword = await bcrypt.compare(loginDto.password, user.password)
            if (user && comparePassword) {
                return user
            }
            
            throw new UnauthorizedException(ExceptionMessage.UNAUTHORIZED)
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async login(loginDto: LoginDto): Promise<AuthorizationResponse>
    {
        try {
            const user = await this.validateUser(loginDto)
            
            const generatedToken = await this.tokensService.updateToken(user)
            return {
                token: generatedToken.token,
                user: user
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async deleteAccount(userId: string): Promise<[User, Token]>
    {
        try {
            const user = await this.usersService.getUserById(userId)
            
            if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)
            
            const token = await this.tokensService.findToken(user)
            
            const deletedUser = await this.usersService.deleteAccount(user)
            const deletedToken = await this.tokensService.deleteToken(token)
            
            return [ deletedUser, deletedToken ]
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<User>
    {
        try {
            const user = await this.usersService.getUserByEmail(changePasswordDto.email)
            
            if (!user) {
                throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)
            }
            
            const hashedPassword = await bcrypt.hash(changePasswordDto.password, 5)
            
            user.password = hashedPassword
            console.log(changePasswordDto.password)
            
            return user
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

}
