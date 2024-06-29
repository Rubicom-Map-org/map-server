import {Controller, Delete, Get, HttpException, HttpStatus, Param, Req, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./users.entity";
import {AuthGuard} from "../auth/auth.guard";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({
        summary: "Getting all users",
        description: "This function returns all user entities, witch does not take any params"
    })
    @ApiResponse({type: [User], status: 200})
    @Get("/get-users")
    async getUsers(): Promise<User[]> {
        try {
            return this.usersService.getUsers()
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
    @Get("/get-user/:username")
    async getUserByUsername(@Param("username") username: string): Promise<User>
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
    @Get("/get-user/:email")
    async getUserByEmail(@Param("email") email: string): Promise<User>
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
    @UseGuards(AuthGuard)
    @ApiResponse({type: User, status: 200})
    @Get("/get-user-profile")
    async getUserProfile(@Req() request): Promise<Partial<User>>
    {
        try {
            const userId = request.user.id
            return this.usersService.getUserProfile(userId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(AuthGuard)
    @Delete("/delete-account")
    async deleteUserAccount(@Req() request): Promise<User> {
        try {
            const userId = request.user.id
            return this.usersService.deleteUserAccount(userId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
