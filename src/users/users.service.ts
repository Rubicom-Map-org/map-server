import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {DeleteResult, InsertResult, Repository} from "typeorm";
import {RegisterDto} from "../auth/dto/register.dto";
import {GetUserProfileDto} from "./dto/get-user-profile.dto";
import {ExceptionMessage} from "../utils/exception-message.enum";
import { UserRepository } from './user-repository.abstract';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService extends UserRepository {
    
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    )
    {
        super();
    }
    
    private readonly userEntityFieldsToSelect: Array<string> = ["id", "username", "email"]
    
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
            const user = await this.usersRepository
                .createQueryBuilder()
                .where("email LIKE :email", {
                    email: `%${email}%`
                })
                .getOne();

            if (!user) {
                throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
            }

            return user;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getUserById(userId: string): Promise<User>
    {
        try {
            const user = await this.usersRepository
                .createQueryBuilder()
                .where("id = :userId", { userId })
                .getOne();

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
            const user = await this.usersRepository
                .createQueryBuilder()
                .where("username LIKE :username", {
                    username: `%${username}%`
                })
                .getOne();

            if (!user) {
                throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
            }
            
            return user
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getUsers(paginationDto: PaginationDto): Promise<User[]>
    {
        try {
            const users = await this.usersRepository
                .createQueryBuilder()
                .orderBy("createdAt")
                .skip(paginationDto.skip)
                .take(paginationDto.take)
                .getMany();

            if (!users) {
                throw new NotFoundException("Not found");
            }

            console.log(users.length);

            return users
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async deleteAccount(userData: User): Promise<DeleteResult>
    {
        try {
            const deletedUser = await this.usersRepository.delete(userData.id);
            return deletedUser;
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
            const userProfile = await this.usersRepository
                .createQueryBuilder()
                .where("id = :userId", { userId: userId })
                .select(["id", "username", "email", "avatarImageUrl"])
                .getOne();
            
            if (!userProfile) {
                throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND)
            }

            return userProfile;
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

    async checkUserExistingByEmail(email: string): Promise<boolean>
    {
        try {
            const user = await this.usersRepository
                .createQueryBuilder()
                .where("email = :email", { email })
                .getOne();

            return !!user;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    
}
