import {forwardRef, Module} from '@nestjs/common';
import {TokensService} from "./tokens.service";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Token} from "./tokens.entity";

@Module({
    providers: [TokensService],
    imports: [
        forwardRef(() => UsersModule),
        forwardRef(() => JwtModule),
        TypeOrmModule.forFeature([Token])
    ],
    exports: [
        TokensService,
        TypeOrmModule
    ]

})
export class TokensModule {}
