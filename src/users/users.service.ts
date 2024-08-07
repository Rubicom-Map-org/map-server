import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {InsertResult, Repository} from "typeorm";
import {RegisterDto} from "../auth/dto/register.dto";
import {GetUserProfileDto} from "./dto/get-user-profile.dto";
import {ExceptionMessage} from "../utils/exception-message.enum";
import {LogMethod} from "../decorators/log-method.decorator";

@Injectable()
export class UsersService {
    
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}
    
    private readonly userEntityFieldsToSelect: Array<string> = ["id", "username", "email"]
    
    @LogMethod()
    async createUser(createUserDto: RegisterDto): Promise<User>
    {
        try {
            const userQueryBuilderResult: InsertResult = await this.usersRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    ...createUserDto,
                })
                .returning(this.userEntityFieldsToSelect)
                .execute()

            const user = userQueryBuilderResult.raw[0] as User;
            
            return await this.usersRepository.save(user);
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async getUserByEmail(email: string): Promise<User>
    {
        try {
            return  await this.usersRepository.findOne({
                where: {email: email}
            })
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getUserById(id: string): Promise<User>
    {
        try {
            const user = await this.usersRepository.findOne({
                where: {id: id}
            })
            if (!user) {
                throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)
            }
            
            return user
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getUserByUsername(username: string): Promise<User>
    {
        try {
            const user = await this.usersRepository.findOne({
                where: {username: username}
            })
            
            return user
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getUsers(): Promise<User[]>
    {
        try {
            const users = await this.usersRepository.find()
            return users
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async deleteAccount(userData: User): Promise<User>
    {
        try {
            const deletedUser = await this.usersRepository.remove(userData)
            return deletedUser
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async saveUser(userData: User): Promise<User>
    {
        try {
            return await this.usersRepository.save(userData)
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getUserProfile(userId: string): Promise<GetUserProfileDto>
    {
        try {
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
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async deleteUserAccount(userId: string): Promise<User>
    {
        try {
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
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }
    
}
