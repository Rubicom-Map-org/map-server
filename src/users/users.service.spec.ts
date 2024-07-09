import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import {ExceptionMessage} from "../utils/exception-message.enum";

describe('UsersService', () => {
    let service: UsersService;
    let usersRepository: Repository<User>;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();
        
        service = module.get<UsersService>(UsersService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });
    
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    describe('createUser', () => {
        it('should create and return a new user', async () => {
            const createUserDto: RegisterDto = {
                email: 'test@example.com',
                password: 'password',
                username: 'testuser',
            };
            const user = { id: '1', ...createUserDto } as User;
            
            jest.spyOn(usersRepository, 'create').mockReturnValue(user);
            jest.spyOn(usersRepository, 'save').mockResolvedValue(user);
            
            const result = await service.createUser(createUserDto);
            
            expect(result).toEqual(user);
            expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
            expect(usersRepository.save).toHaveBeenCalledWith(user);
        });
    });
    
    describe('getUserByEmail', () => {
        it('should return a user by email', async () => {
            const email = 'test@example.com';
            const user = { id: '1', email } as User;
            
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
            
            const result = await service.getUserByEmail(email);
            
            expect(result).toEqual(user);
            expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email } });
        });
    });
    
    describe('getUserById', () => {
        it('should return a user by id', async () => {
            const id = '1';
            const user = { id, email: 'test@example.com' } as User;
            
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
            
            const result = await service.getUserById(id);
            
            expect(result).toEqual(user);
            expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id } });
        });
        
        it('should throw a NotFoundException if user is not found', async () => {
            const id = '1';
            
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
            
            await expect(service.getUserById(id)).rejects.toThrow(new NotFoundException(service.NOT_FOUND_USER_MESSAGE));
        });
    });
    
    describe('getUserByUsername', () => {
        it('should return a user by username', async () => {
            const username = 'testuser';
            const user = { id: '1', username } as User;
            
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
            
            const result = await service.getUserByUsername(username);
            
            expect(result).toEqual(user);
            expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { username } });
        });
    });
    
    describe('getUsers', () => {
        it('should return an array of users', async () => {
            const users = [{ id: '1', email: 'test@example.com' }] as User[];
            
            jest.spyOn(usersRepository, 'find').mockResolvedValue(users);
            
            const result = await service.getUsers();
            
            expect(result).toEqual(users);
            expect(usersRepository.find).toHaveBeenCalled();
        });
    });
    
    describe('deleteAccount', () => {
        it('should delete and return the user', async () => {
            const user = { id: '1', email: 'test@example.com' } as User;
            
            jest.spyOn(usersRepository, 'remove').mockResolvedValue(user);
            
            const result = await service.deleteAccount(user);
            
            expect(result).toEqual(user);
            expect(usersRepository.remove).toHaveBeenCalledWith(user);
        });
    });
    
    describe('saveUser', () => {
        it('should save and return the user', async () => {
            const user = { id: '1', email: 'test@example.com' } as User;
            
            jest.spyOn(usersRepository, 'save').mockResolvedValue(user);
            
            const result = await service.saveUser(user);
            
            expect(result).toEqual(user);
            expect(usersRepository.save).toHaveBeenCalledWith(user);
        });
    });
    
    describe('getUserProfile', () => {
        it('should return user profile data', async () => {
            const user = { id: '1', username: 'testuser', email: 'test@example.com', avatarImageUrl: 'avatar.jpg' } as User;
            const expectedProfile: GetUserProfileDto = {
                username: 'testuser',
                email: 'test@example.com',
                avatarImageUrl: 'avatar.jpg',
            };
            
            jest.spyOn(service, 'getUserById').mockResolvedValue(user);
            
            const result = await service.getUserProfile(user.id);
            
            expect(result).toEqual(expectedProfile);
            expect(service.getUserById).toHaveBeenCalledWith(user.id);
        });
        
        it('should throw a NotFoundException if user is not found', async () => {
            const userId = '1';
            
            jest.spyOn(service, 'getUserById').mockResolvedValue(null);
            
            await expect(service.getUserProfile(userId)).rejects.toThrow(new NotFoundException(service.NOT_FOUND_USER_MESSAGE));
        });
    });
    
    describe('deleteUserAccount', () => {
        it('should delete and return the user with relations', async () => {
            const user = {
                id: '1',
                email: 'test@example.com',
                savedPlaces: [],
                token: null,
                file: null,
                chatRequests: [],
                chats: [],
            } as User;
            
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(usersRepository, 'remove').mockResolvedValue(user);
            
            const result = await service.deleteUserAccount(user.id);
            
            expect(result).toEqual(user);
            expect(usersRepository.findOne).toHaveBeenCalledWith({
                where: { id: user.id },
                relations: ['savedPlaces', 'token', 'file', 'chatRequests', 'chats'],
            });
            expect(usersRepository.remove).toHaveBeenCalledWith(user);
        });
        
        it('should throw a NotFoundException if user is not found', async () => {
            const userId = '1';
            
            jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
            
            await expect(service.deleteUserAccount(userId)).rejects.toThrow(new NotFoundException(ExceptionMessage.USER_NOT_FOUND));
        });
    });
});
