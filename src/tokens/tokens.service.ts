import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {User} from "../users/users.entity";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Token} from "./tokens.entity";
import {DeleteResult, Repository} from "typeorm";
import { ExceptionMessage } from '../utils/exception-message.enum';
import { jwtConstants } from '../utils/constants';

@Injectable()
export class TokensService {

    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly jwtService: JwtService
    ) {}

    private assignToken(tokenPayload: Partial<User>): string {
        return this.jwtService.sign(tokenPayload, {
            secret: jwtConstants.secretKey,
            expiresIn: jwtConstants.signOptions.expiresIn
        });
    }

    async generateToken(userData?: User): Promise<Token> {
        try {
            const { id, username, email } = userData;
            const payload = { id, username, email };

            const tokenValue = this.assignToken(payload);

            const token = this.tokenRepository.create({token: tokenValue});
            return await this.tokenRepository.save(token);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateToken(userData?: User): Promise<Token | null> {
        const { id, username, email } = userData;
        const token = await this.tokenRepository.findOne({ where: { user: { id } } });

        if (!token) {
            throw new NotFoundException(ExceptionMessage.TOKEN_NOT_FOUND);
        }
            
        const payload = { id, username, email };
        token.token = this.assignToken(payload);
        return this.saveToken(token);
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
