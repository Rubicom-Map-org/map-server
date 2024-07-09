import {forwardRef, Module} from '@nestjs/common';
import {TokensService} from "./tokens.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Token} from "./tokens.entity";
import {JwtModule} from "@nestjs/jwt";

@Module({
    providers: [TokensService],
    controllers: [],
    imports: [
        TypeOrmModule.forFeature([Token]),
        forwardRef(() => JwtModule),
        JwtModule
    ],
    exports: [
        TokensService,
        TypeOrmModule,
        JwtModule
    ]
})
export class TokensModule {}
