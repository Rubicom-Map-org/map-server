import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Req, Res, UseGuards} from '@nestjs/common';
import {UsersService} from "../services/users.service";
import {User} from "../entities/users.entity";
import {AuthGuard} from "../../auth/auth.guard";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {GetUserProfileDto} from "../dto/get-user-profile.dto";
import {Token} from "../entities/tokens.entity";

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {
    }

    @ApiOperation({
        summary: "Getting all users",
        description: "This function returns all user entities, witch does not take any params"
    })
    @ApiResponse({type: [User], status: 200})
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
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
    @ApiResponse({type: User, status: 200})
    @UseGuards(AuthGuard)
    @Get("/get-user-profile")
    async getUserProfile(@Req() request): Promise<Partial<User>>
    {
        try {
            const email = request.user.email
            return this.usersService.getUserProfile(email)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    // @UseGuards(AuthGuard)
    // @Delete("/delete-account")
    // async deleteUserAccount(@Req() request): Promise<[User, Token]> {
    //     try {
    //         const userId = request.user.id
    //         return this.usersService.deleteUserAccount(userId)
    //     } catch (error) {
    //         throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    // }

}
