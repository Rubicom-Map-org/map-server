import { Controller, Delete, Get, HttpException, HttpStatus, Param, Query, Req, UseGuards } from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./users.entity";
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {UserId} from "../decorators/user-id.decorator";
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRepository } from './user-repository.abstract';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
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
        return this.usersService.getUsers(paginationDto);
    }

    @ApiOperation({
        summary: "Getting user by username",
        description: "This function returns USER entity "
    })
    @ApiResponse({type: User, status: 200})
    @Get()
    async getUserById(@UserId() userId:string): Promise<User> {
        return this.usersService.getUserByUsername(userId);
    }
    
    @ApiOperation({
        summary: "Getting user by username",
        description: "This function returns USER entity, witch takes one string param - username, " +
            "you have to take this param in your API url"
    })
    @ApiResponse({type: User, status: 200})
    @Get("/by-username")
    async getUserByUsername(@Query("username") username: string): Promise<User> {
        return this.usersService.getUserByUsername(username)
    }
    
    @ApiOperation({
        summary: "Getting user by email",
        description: "This function returns USER entity, witch takes one string param - email, " +
            "you have to take this param in your API url"
    })
    @ApiResponse({type: User, status: 200})
    @Get("/by-email")
    async getUserByEmail(@Query("email") email: string): Promise<User> {
        return this.usersService.getUserByEmail(email)
    }
    
    @ApiOperation({
        summary: "Getting user profile",
        description: "This function returns User by GetUserProfileDto, witch takes three fields: " +
            "username, email, avatarImageUrl"
    })
    @ApiResponse({type: User, status: 200})
    @Get("/get-user-profile")
    async getUserProfile(@UserId() userId: string): Promise<GetUserProfileDto> {
        return this.usersService.getUserProfile(userId)
    }

    @Delete("/delete-account")
    async deleteUserAccount(@UserId() userId: string): Promise<User> {
        return this.usersService.deleteUserAccount(userId)
    }

}
