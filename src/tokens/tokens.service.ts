import { Injectable, NotFoundException } from '@nestjs/common';
import {User} from "../users/users.entity";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Token} from "./tokens.entity";
import {DeleteResult, Repository} from "typeorm";
import { ExceptionMessage } from '../utils/exception-message.enum';

@Injectable()
export class TokensService {

    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly jwtService: JwtService
    ) {}

    async generateToken(userData?: User): Promise<Token> {
        const payload = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
        }

        const tokenValue = this.jwtService.sign(payload);
        console.log("TOKEN VALUE: ", tokenValue);
        const token = this.tokenRepository.create({token: tokenValue});
        return await this.tokenRepository.save(token);
    }

    async updateToken(userData?: User): Promise<Token | null> {
        const token = await this.tokenRepository.findOne({ where: { user: userData } });

        if (!token) {
            throw new NotFoundException(ExceptionMessage.TOKEN_NOT_FOUND);
        }
            
        const payload = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            password: userData.password
        }
                
        token.token = this.jwtService.sign(payload);
        return await this.tokenRepository.save(token);
    }

    async saveToken(token: Token): Promise<Token> {
        return await this.tokenRepository.save(token);
    }

    async findToken(userData: User): Promise<Token> {
        return await this.tokenRepository.findOne({ where: {user: userData} });
    }

    async deleteToken(token: Token): Promise<DeleteResult> {
        return await this.tokenRepository.delete({ id: token.id })
    }

}
