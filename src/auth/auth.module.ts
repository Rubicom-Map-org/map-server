import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UsersModule} from "../users/users.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {TokensModule} from "../tokens/tokens.module";
import * as dotenv from "dotenv";
import * as process from "node:process";
dotenv.config();

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UsersModule),
        TokensModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY || "secret",
            signOptions: {
                expiresIn: "336h"
            }
        })
    ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
