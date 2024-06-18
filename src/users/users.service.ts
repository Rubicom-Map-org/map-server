import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {Repository} from "typeorm";
import {RegisterDto} from "../auth/dto/register.dto";
import {GetUserProfileDto} from "./dto/get-user-profile.dto";

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User)
                private readonly usersRepository: Repository<User>)
    {
    }

    NOT_FOUND_USER_MESSAGE = "user was not found"

    async createUser(createUserDto: RegisterDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto)

        return await this.usersRepository.save(user)
    }

    async getUserByEmail(email: string): Promise<User> {
        return  await this.usersRepository.findOne({
            where: {email: email}
        })
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

    async getUserProfile(userId: string): Promise<GetUserProfileDto> {
        const user = await this.getUserById(userId)

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

    async deleteUserAccount(userId: string): Promise<User> {

        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: [
                "savedPlaces",
                "token",
                "file",
                "chatRequests",
                "chats"
            ]
        })

        return await this.usersRepository.remove(user)
    }


}
