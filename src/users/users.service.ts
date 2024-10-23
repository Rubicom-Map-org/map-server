import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
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
    ) {
        super();
    }
    
    private readonly userEntityFieldsToSelect: Array<string> = ["id", "username", "email"];
    
    async createUser(createUserDto: RegisterDto): Promise<User> {
        try {
            const userQueryBuilderResult: InsertResult = await this.usersRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    ...createUserDto,
                })
                .returning(this.userEntityFieldsToSelect)
                .execute();

            const user = userQueryBuilderResult.raw[0] as User;
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error.code === "23505") {
                throw new BadRequestException(ExceptionMessage.USER_ALREADY_EXISTS);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    private async getUserByField(field: string, value: string | number): Promise<User> {
        const user = await this.usersRepository
            .createQueryBuilder()
            .where(`${field} = :value`, { value })
            .getOne();

        if (!user) {
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.getUserByField("email", email);
    }

    async getUserById(userId: string): Promise<User> {
        return this.getUserByField("id", userId);
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.getUserByField("username", username);
    }

    async getUsers(paginationDto: PaginationDto): Promise<User[]> {
        const users = await this.usersRepository
            .createQueryBuilder()
            .orderBy("createdAt")
            .skip(paginationDto.skip)
            .take(paginationDto.take)
            .getMany();

        if (!users) {
            throw new NotFoundException("Not found");
        }
        return users;
    }

    async deleteAccount(userData: User): Promise<DeleteResult> {
        const deletedUser = await this.usersRepository.delete(userData.id);
        return deletedUser;
    }

    async saveUser(userData: User): Promise<User> {
        return await this.usersRepository.save(userData);
    }

    async getUserProfile(userId: string): Promise<GetUserProfileDto> {
        const userProfile = await this.usersRepository
            .createQueryBuilder()
            .where("id = :userId", { userId: userId })
            .select(["id", "username", "email", "avatarImageUrl"])
            .getOne();
            
        if (!userProfile) {
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }
        return userProfile;
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
        });
            
        if (!user) {
            throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
        }
        return await this.usersRepository.remove(user);
    }
}
