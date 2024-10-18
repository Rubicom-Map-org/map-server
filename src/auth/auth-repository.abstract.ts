import { RegisterDto } from './dto/register.dto';
import { AuthorizationResponseDto } from './dto/authorization-response.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../users/users.entity';

export abstract class AuthRepository {
    abstract registration(registrationDto: RegisterDto): Promise<AuthorizationResponseDto>;
    abstract login(loginDto: LoginDto): Promise<AuthorizationResponseDto>;
    abstract deleteAccount(userId: string): Promise<void>;
    abstract changePassword(changePasswordDto: ChangePasswordDto): Promise<User>;
}