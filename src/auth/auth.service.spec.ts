import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { Token } from '../tokens/tokens.entity';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let tokensService: TokensService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        getUserByEmail: jest.fn(),
                        getUserByUsername: jest.fn(),
                        createUser: jest.fn(),
                        getUserById: jest.fn(),
                        deleteAccount: jest.fn(),
                    },
                },
                {
                    provide: TokensService,
                    useValue: {
                        generateToken: jest.fn(),
                        saveToken: jest.fn(),
                        updateToken: jest.fn(),
                        findToken: jest.fn(),
                        deleteToken: jest.fn(),
                    },
                },
            ],
        }).compile();
        
        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        tokensService = module.get<TokensService>(TokensService);
    });
    
    describe('registration', () => {
        it('should throw an error if email already exists', async () => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce({} as User);
            const registerDto: RegisterDto = { email: 'test@test.com', username: 'testuser', password: 'password' };
            
            await expect(authService.registration(registerDto)).rejects.toThrow(BadRequestException);
        });
        
        it('should throw an error if username already exists', async () => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);
            jest.spyOn(usersService, 'getUserByUsername').mockResolvedValueOnce({} as User);
            const registerDto: RegisterDto = { email: 'test@test.com', username: 'testuser', password: 'password' };
            
            await expect(authService.registration(registerDto)).rejects.toThrow(BadRequestException);
        });
        
        it('should create a new user and return a token', async () => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);
            jest.spyOn(usersService, 'getUserByUsername').mockResolvedValueOnce(null);
            jest.spyOn(usersService, 'createUser').mockResolvedValueOnce({} as User);
            jest.spyOn(tokensService, 'generateToken').mockResolvedValueOnce({ token: 'token' } as Token);
            
            const registerDto: RegisterDto = { email: 'test@test.com', username: 'testuser', password: 'password' };
            const result = await authService.registration(registerDto);
            
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
        });
    });
    
    describe('validateUser', () => {
        it('should throw an error if user is not found', async () => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);
            const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
            
            await expect(authService.validateUser(loginDto)).rejects.toThrow(BadRequestException);
        });
        
        it('should throw an error if password is incorrect', async () => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce({ password: 'hashedpassword' } as User);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);
            const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
            
            await expect(authService.validateUser(loginDto)).rejects.toThrow(UnauthorizedException);
        });
        
        it('should return the user if credentials are valid', async () => {
            const user = { password: 'hashedpassword' } as User;
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
            const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
            
            const result = await authService.validateUser(loginDto);
            
            expect(result).toEqual(user);
        });
    });
    
    describe('login', () => {
        it('should return a token and user on successful login', async () => {
            const user = {} as User;
            jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user);
            jest.spyOn(tokensService, 'updateToken').mockResolvedValueOnce({ token: 'token' } as Token);
            const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
            
            const result = await authService.login(loginDto);
            
            expect(result).toHaveProperty('token');
            expect(result).toHaveProperty('user');
        });
    });
    
    describe('deleteAccount', () => {
        it('should throw an error if user is not found', async () => {
            jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(null);
            
            await expect(authService.deleteAccount('1')).rejects.toThrow(NotFoundException);
        });
        
        it('should delete the user and token', async () => {
            const user = {} as User;
            const token = {} as Token;
            jest.spyOn(usersService, 'getUserById').mockResolvedValueOnce(user);
            jest.spyOn(tokensService, 'findToken').mockResolvedValueOnce(token);
            jest.spyOn(usersService, 'deleteAccount').mockResolvedValueOnce(user);
            jest.spyOn(tokensService, 'deleteToken').mockResolvedValueOnce(token);
            
            const result = await authService.deleteAccount('1');
            
            expect(result).toEqual([user, token]);
        });
    });
    
    describe('changePassword', () => {
        it('should throw an error if user is not found', async () => {
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(null);
            const changePasswordDto: ChangePasswordDto = { email: 'test@test.com', password: 'newpassword' };
            
            await expect(authService.changePassword(changePasswordDto)).rejects.toThrow(NotFoundException);
        });
        
        it('should change the password and return the user', async () => {
            const user = { password: 'oldpassword' } as User;
            jest.spyOn(usersService, 'getUserByEmail').mockResolvedValueOnce(user);
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashednewpassword');
            const changePasswordDto: ChangePasswordDto = { email: 'test@test.com', password: 'newpassword' };
            
            const result = await authService.changePassword(changePasswordDto);
            
            expect(result.password).toEqual('hashednewpassword');
        });
    });
});
