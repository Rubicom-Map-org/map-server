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
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {ChangePasswordDto} from "./dto/change-password.dto";
import {UserId} from "../decorators/user-id.decorator";
import {AuthGuard} from "./auth.guard";
import {AuthorizationResponseDto} from "./dto/authorization-response.dto";
import { ConfirmAuthDto } from './dto/confirm-auth.dto';

@Controller('auth')
export class AuthController {
    
    constructor(private readonly authService: AuthService) {}
    
    @ApiOperation({ summary: "Registration" })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiBody({ type: RegisterDto })
    @Post("registration")
    @UsePipes(ValidationPipe)
    async registration(@Body() registerDto: RegisterDto): Promise<void> {
        return this.authService.registration(registerDto);
    }

    @ApiOperation({ summary: "Confirm registration" })
    @ApiResponse({ type: AuthorizationResponseDto, status: HttpStatus.CREATED })
    @ApiBody({ type: ConfirmAuthDto })
    @Post("confirm-registration")
    async confirmRegistration(
        @Body() confirmRegistrationDto: ConfirmAuthDto
    ): Promise<AuthorizationResponseDto> {
        return this.authService.confirmAuth(confirmRegistrationDto);
    }
    
    @ApiOperation({ summary: "Login" })
    @ApiResponse({ status: HttpStatus.OK })
    @ApiBody({ type: LoginDto })
    @Post("login")
    @UsePipes(ValidationPipe)
    async login(@Body() loginDto: LoginDto): Promise<void> {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: "Confirm login" })
    @ApiResponse({ status: HttpStatus.CREATED, type: AuthorizationResponseDto })
    @ApiBody({ type: ConfirmAuthDto })
    @Post("confirm-login")
    @UsePipes(ValidationPipe)
    async confirmLogin(@Body() confirmAuthDto: ConfirmAuthDto): Promise<AuthorizationResponseDto> {
        return this.authService.confirmAuth({ ...confirmAuthDto, forLogin: true });
    }

    @ApiOperation({ summary: "Deleting account" })
    @UseGuards(AuthGuard)
    @Delete("delete-account")
    async deleteAccount(@UserId() userId: string): Promise<void> {
        return this.authService.deleteAccount(userId);
    }
    
    @ApiOperation({ summary: "Changing password" })
    @ApiResponse({ type: User, status: 200 })
    @UsePipes(ValidationPipe)
    @Patch("change-password")
    async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<User> {
        return this.authService.changePassword(changePasswordDto);
    }
    
}
