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
    providers: [AuthService, JwtService],
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY || "secret",
            signOptions: {
                expiresIn: "336h",
            }
        }),
        TokensModule
    ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
