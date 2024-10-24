import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';


export class CreateUserDto {
    @IsNotEmpty({message: "username can not be empty"})
    readonly username: string;

    @IsEmail()
    @IsNotEmpty({message: "Email can not be empty"})
    readonly email: string;

    @Length(6, 100)
    readonly password: string;

    @IsString()
    readonly confirmationCode: string;
}