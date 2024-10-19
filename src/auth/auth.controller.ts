import {
    Body,
    Controller,
    Delete,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {User} from "../users/users.entity";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {ChangePasswordDto} from "./dto/change-password.dto";
import {UserId} from "../decorators/user-id.decorator";
import {AuthGuard} from "./auth.guard";
import {AuthorizationResponseDto} from "./dto/authorization-response.dto";
import { AuthRepository } from './auth-repository.abstract';

@Controller('auth')
export class AuthController extends AuthRepository {
    
    constructor(private readonly authService: AuthService) {
        super();
    }
    
    @ApiOperation({
        summary: "Registration",
        description: "This function saves USER entity to database according all registration validations, " +
            "also returns JWT token witch determines whether user is authorized and saves DTO user data"
    })
    @ApiResponse({type: AuthorizationResponseDto, status: HttpStatus.CREATED})
    @Post("/registration")
    @UsePipes(ValidationPipe)
    async registration(@Body() registerDto: RegisterDto): Promise<AuthorizationResponseDto> {
        return this.authService.registration(registerDto);
    }
    
    @ApiOperation({
        summary: "Authorization",
        description: "This function returns User entity and token, " +
            "validates all user data ( username, email, password ) and generates new JWT token, " +
            "witch determines whether user is authorized, this function takes login body param: " +
            "( username, email, password )"
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: AuthorizationResponseDto})
    @Post("/login")
    @UsePipes(ValidationPipe)
    async login(@Body() loginDto: LoginDto): Promise<AuthorizationResponseDto> {
        return this.authService.login(loginDto);
    }
    
    @ApiOperation({
        summary: "Deleting account",
        description: "This function deletes both entities User and Token and takes only one param - user ID, witch we take from request" +
            ",AKA, from JWT token"
    })
    @UseGuards(AuthGuard)
    @Delete("/delete-account")
    async deleteAccount(@UserId() userId: string): Promise<void> {
        return this.authService.deleteAccount(userId);
    }
    
    @ApiOperation({
        summary: "Changing password",
        description: ""
    })
    @ApiResponse({type: User, status: 200})
    @UsePipes(ValidationPipe)
    @Patch("/change-password")
    async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<User> {
        return this.authService.changePassword(changePasswordDto);
    }
    
}
