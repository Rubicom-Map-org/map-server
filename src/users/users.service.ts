import {BadRequestException, forwardRef, Get, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/users.entity";
import {Repository} from "typeorm";
import { Connection } from "typeorm";
import {RegisterDto} from "../../auth/dto/register.dto";
import {Token} from "../entities/tokens.entity";
import {GetUserProfileDto} from "../dto/get-user-profile.dto";
import * as stream from "node:stream";
import {TokensService} from "./tokens.service";

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User)
                private readonly usersRepository: Repository<User>,
                private readonly connection: Connection) {
    }

    NOT_FOUND_USER_MESSAGE = "user was not found"

    async createUser(createUserDto: RegisterDto): Promise<User> {
        const user = await this.usersRepository.create(createUserDto)

        return await this.usersRepository.save(user)
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {email: email}
        })
        return user
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {id: id}
        })
        if (!user) {
            throw new NotFoundException(this.NOT_FOUND_USER_MESSAGE)
        }

        return user
    }

    async getUserByUsername(username: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {username: username}
        })

        return user
    }

    async getUsers(): Promise<User[]> {
        const users = await this.usersRepository.find()
        return users
    }

    async deleteAccount(userData: User): Promise<User> {
        const deletedUser = await this.usersRepository.remove(userData)
        return deletedUser

    }

    async saveUser(userData: User): Promise<User> {
        return await this.usersRepository.save(userData)
    }

    async getUserProfile(userEmail: string): Promise<GetUserProfileDto> {
        const user = await this.getUserByEmail(userEmail)

        if (!user) {
            throw new NotFoundException(this.NOT_FOUND_USER_MESSAGE)
        }

        const getUserProfileDto = {
            username: user.username,
            email: user.email,
            avatarImageUrl: user.avatarImageUrl
        }

        return getUserProfileDto
    }


}
