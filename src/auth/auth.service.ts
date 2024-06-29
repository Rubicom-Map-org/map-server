import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {RegisterDto} from "./dto/register.dto";
import {TokensService} from "../tokens/tokens.service";
import {User} from "../users/users.entity";
import {LoginDto} from "./dto/login.dto";
import * as bcrypt from "bcrypt"
import {Token} from "../tokens/tokens.entity";
import {ChangePasswordDto} from "./dto/change-password.dto";

export interface AuthorizationResponse {
    token: string,
    user: User
}

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
                private readonly tokensService: TokensService)
    {
    }

    UNAUTHORIZED_USER_MESSAGE = "user is not authorized"

    async registration(registerDto: RegisterDto): Promise<AuthorizationResponse> {

        const userCheckByEmail = await this.usersService.getUserByEmail(registerDto.email)
        const userCheckUsername = await this.usersService.getUserByUsername(registerDto.username)

        if (userCheckByEmail) {
            throw new BadRequestException("User with that email already exists")
        }

        if (userCheckUsername) {
            throw new BadRequestException("User with that username already exists")
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
    }

    async validateUser(loginDto: LoginDto): Promise<User> {
        const user = await this.usersService.getUserByEmail(loginDto.email)

        if (!user) {
            throw new BadRequestException("User with that email was not found")
        }

        const comparePassword = await bcrypt.compare(loginDto.password, user.password)
        if (user && comparePassword) {
            return user
        }

        throw new UnauthorizedException({message: this.UNAUTHORIZED_USER_MESSAGE})
    }

    async login(loginDto: LoginDto): Promise<AuthorizationResponse> {
        const user = await this.validateUser(loginDto)

        const generatedToken = await this.tokensService.updateToken(user)
        return {
            token: generatedToken.token,
            user: user
        }
    }

    async deleteAccount(userId: string): Promise<[User, Token]> {

        const user = await this.usersService.getUserById(userId)
        const token = await this.tokensService.findToken(user)

        const deletedUser = await this.usersService.deleteAccount(user)
        const deletedToken = await this.tokensService.deleteToken(token)

        return [ deletedUser, deletedToken ]

    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
        const user = await this.usersService.getUserByEmail(changePasswordDto.email)

        if (!user) {
            throw new BadRequestException("User with this email was not found")
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.password, 5)

        user.password = hashedPassword
        console.log(changePasswordDto.password)

        return user

    }

}
