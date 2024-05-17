import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";


export class GetUserProfileDto {

    @IsNotEmpty({message: "Username is required"})
    @Length(4, 99)
    readonly username: string;

    @IsEmail({}, {message: "Invalid email address"})
    @IsNotEmpty({message: "Email is required"})
    @Length(8, 99)
    readonly email: string;

    @IsString()
    readonly avatarImageUrl: string;

}