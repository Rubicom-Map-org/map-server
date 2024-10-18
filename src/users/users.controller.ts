import { Controller, Delete, Get, HttpException, HttpStatus, Param, Query, Req, UseGuards } from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./users.entity";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {UserId} from "../decorators/user-id.decorator";
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRepository } from './user-repository.abstract';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { PaginationDto } from '../common/dto/pagination.dto';


@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    
    constructor(private usersService: UsersService) {};
    
    @ApiOperation({
        summary: "Getting all users",
        description: "This function returns all user entities, witch does not take any params"
    })
    @ApiResponse({type: [User], status: 200})
    @Get("/get-users")
    async getUsers(@Query() paginationDto: PaginationDto): Promise<User[]> {
        try {
            return this.usersService.getUsers(paginationDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiOperation({
        summary: "Getting user by username",
        description: "This function returns USER entity "
    })
    @ApiResponse({type: User, status: 200})
    @Get("/get-user")
    async getUserById(@UserId() userId:string): Promise<User>
    {
        try {
            return this.usersService.getUserByUsername(userId);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @ApiOperation({
        summary: "Getting user by username",
        description: "This function returns USER entity, witch takes one string param - username, " +
            "you have to take this param in your API url"
    })
    @ApiResponse({type: User, status: 200})
    @Get("/get-user-by-username")
    async getUserByUsername(@Query("username") username: string): Promise<User>
    {
        try {
            return this.usersService.getUserByUsername(username)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @ApiOperation({
        summary: "Getting user by email",
        description: "This function returns USER entity, witch takes one string param - email, " +
            "you have to take this param in your API url"
    })
    @ApiResponse({type: User, status: 200})
    @Get("/get-user-by-email")
    async getUserByEmail(@Query("email") email: string): Promise<User>
    {
        try {
            return this.usersService.getUserByEmail(email)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @ApiOperation({
        summary: "Getting user profile",
        description: "This function returns User by GetUserProfileDto, witch takes three fields: " +
            "username, email, avatarImageUrl"
    })
    @ApiResponse({type: User, status: 200})
    @Get("/get-user-profile")
    async getUserProfile(@UserId() userId: string): Promise<GetUserProfileDto>
    {
        try {
            return this.usersService.getUserProfile(userId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete("/delete-account")
    async deleteUserAccount(@UserId() userId: string): Promise<User> {
        try {
            return this.usersService.deleteUserAccount(userId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
