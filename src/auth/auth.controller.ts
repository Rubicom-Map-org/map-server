import {
    Body,
    Controller,
    Delete,
    HttpException,
    HttpStatus, Patch,
    Post,
    Req, UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {User} from "../users/users.entity";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Token} from "../tokens/tokens.entity";
import {ChangePasswordDto} from "./dto/change-password.dto";
import {UserId} from "../decorators/user-id.decorator";
import {AuthGuard} from "./auth.guard";


@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService: AuthService) {}
    
    @ApiOperation({
        summary: "Registration",
        description: "This function saves USER entity to database according all registration validations, " +
            "also returns JWT token witch determines whether user is authorized and saves DTO user data"
    })
    @ApiResponse({type: User, status: HttpStatus.CREATED})
    @Post("/registration")
    @UsePipes(ValidationPipe)
    async registration(@Body() registerDto: RegisterDto) {
        try {
            return this.authService.registration(registerDto)
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @ApiOperation({
        summary: "Authorization",
        description: "This function returns User entity and token, " +
            "validates all user data ( username, email, password ) and generates new JWT token, " +
            "witch determines whether user is authorized, this function takes login body param: " +
            "( username, email, password )"
    })
    @ApiResponse({type: User, status: HttpStatus.CREATED})
    @Post("/login")
    @UsePipes(ValidationPipe)
    async login(@Body() loginDto: LoginDto) {
        try {
            return this.authService.login(loginDto)
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @ApiOperation({
        summary: "Deleting account",
        description: "This function deletes both entities User and Token and takes only one param - user ID, witch we take from request" +
            ",AKA, from JWT token"
    })
    @ApiResponse({type: Token && User, status: 200})
    @UseGuards(AuthGuard)
    @Delete("/delete-account")
    async deleteAccount(@UserId() userId: string): Promise<[User, Token]> {
        try {
            return this.authService.deleteAccount(userId)
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @ApiOperation({
        summary: "Changing password",
        description: ""
    })
    @ApiResponse({type: User, status: 200})
    @UsePipes(ValidationPipe)
    @Patch("/change-password")
    async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<User> {
        try {
            return this.authService.changePassword(changePasswordDto)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}
