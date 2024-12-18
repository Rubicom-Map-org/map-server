import {forwardRef, Module} from '@nestjs/common';
import {TokensService} from "./tokens.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Token} from "./tokens.entity";
import {JwtModule} from "@nestjs/jwt";
import { ConfigModule } from '@nestjs/config';

@Module({
    providers: [TokensService],
    controllers: [],
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Token]),
        JwtModule
    ],
    exports: [
        TokensService,
        TypeOrmModule,
    ]
})
export class TokensModule {}
