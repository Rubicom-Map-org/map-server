import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.entity';
import { DeleteResult } from 'typeorm';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

export abstract class UserRepository {
    abstract createUser(createUserDto: CreateUserDto): Promise<User>;
    abstract getUserByEmail(email: string): Promise<User>;
    abstract getUserById(userId: string): Promise<User>;
    abstract getUserByUsername(username: string): Promise<User>;
    abstract getUsers(paginationDto: PaginationDto): Promise<User[]>;
    abstract deleteUserAccount(userId: string): Promise<User>;
    abstract saveUser(userData: User): Promise<User>;
    abstract getUserProfile(userId: string): Promise<GetUserProfileDto>;
}