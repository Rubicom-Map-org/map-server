import {ApiProperty} from "@nestjs/swagger";
import {Token} from "../../tokens/tokens.entity";
import {User} from "../../users/users.entity";

export class AuthorizationResponseDto {
    
    @ApiProperty()
    readonly token: string
    
    @ApiProperty()
    readonly user: User
    
}