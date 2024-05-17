import {forwardRef, Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";
import {AuthService} from "../auth/auth.service";
import {AuthModule} from "../auth/auth.module";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        forwardRef(() => AuthModule),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY || "secret",
            signOptions: {
                expiresIn: "336h"
            }
        }),
        TypeOrmModule.forFeature([User])
    ],
    exports: [
        UsersService,
        TypeOrmModule
    ]
})
export class UsersModule {}
