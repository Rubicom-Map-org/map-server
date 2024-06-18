import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {User} from "../entities/users.entity";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Token} from "../entities/tokens.entity";
import {Repository} from "typeorm";
import {UsersService} from "./users.service";

@Injectable()
export class TokensService {

    constructor(@InjectRepository(Token)
                private readonly tokenRepository: Repository<Token>,
                @Inject(forwardRef(() => UsersService))
                private readonly usersService: UsersService,
                private readonly jwtService: JwtService)
    {
    }

    async generateToken(userData?: User) {
        const payload = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            password: userData.password
        }

        const tokenValue = this.jwtService.sign(payload)
        const token = this.tokenRepository.create({token: tokenValue})
        return await this.tokenRepository.save(token)
    }

    async updateToken(userData?: User) {
        const token = await this.tokenRepository.findOne({
            where: {user: userData}
        })

        if (token) {
            const payload = {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                password: userData.password
            }

            token.token = this.jwtService.sign(payload)
            console.log(token)
            return await this.tokenRepository.save(token)
        }
    }

    async saveToken(token: Token): Promise<Token> {
        return await this.tokenRepository.save(token)
    }

    async findToken(userData: User): Promise<Token> {

        return await this.tokenRepository.findOne({
            where: {user: userData}
        })

    }

    async deleteToken(token: Token): Promise<Token> {
        return await this.tokenRepository.remove(token)
    }

    async getToken(userId: string): Promise<Token> {
        const user = await this.usersService.getUserById(userId)
        return await this.tokenRepository.findOne({
            where: { user: user }
        })
    }

}
