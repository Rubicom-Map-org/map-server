import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {InsertResult, Repository} from "typeorm";
import {RegisterDto} from "../auth/dto/register.dto";
import {GetUserProfileDto} from "./dto/get-user-profile.dto";
import {ExceptionMessage} from "../utils/exception-message.enum";
import {LogMethod} from "../decorators/log-method.decorator";

@Injectable()
export class UsersService {
    
    constructor(@InjectRepository(User)
                private readonly usersRepository: Repository<User>)
    {
    }
    
    private readonly userEntityFieldsToSelect: Array<string> = ["id", "username", "email"]
    
    @LogMethod()
    async createUser(createUserDto: RegisterDto): Promise<User>
    {
        try {
            const userEntityInsertionResult: Promise<InsertResult> = this.usersRepository
                .createQueryBuilder("user")
                .insert()
                .into(User)
                .values({
                    ...createUserDto
                })
                .returning(this.userEntityFieldsToSelect)
                .execute()
            
            const user = (await userEntityInsertionResult).raw[0]
            
            if (user.username === "Максим Гриньків") {
                throw new BadRequestException("Цей користувач - ГЕЙ")
                return await this.deleteUserAccount(user)
            }
            
            return user
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
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
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)
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
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)
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
        
        if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)

        return await this.usersRepository.remove(user)
    }
    
}
