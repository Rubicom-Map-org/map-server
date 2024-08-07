import {HttpException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {User} from "../users/users.entity";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Token} from "./tokens.entity";
import {Repository} from "typeorm";

@Injectable()
export class TokensService {

    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly jwtService: JwtService
    ) {}

    async generateToken(userData?: User)
    {
        try {
            const payload = {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                password: userData.password
            }
            
            const tokenValue = this.jwtService.sign(payload)
            const token = this.tokenRepository.create({token: tokenValue})
            return await this.tokenRepository.save(token)
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async updateToken(userData?: User)
    {
        try {
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
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async saveToken(token: Token): Promise<Token>
    {
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

}
