import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmAuthDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly confirmationCode: string;

    @ApiProperty()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsBoolean()
    readonly forLogin: boolean = false;
}