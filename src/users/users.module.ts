import {forwardRef, Module} from '@nestjs/common';
import {AuthModule} from "../auth/auth.module";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {JwtModule, JwtService} from "@nestjs/jwt";
import process from "node:process";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([User]),
        JwtModule
    ],
    exports: [
        UsersService,
        TypeOrmModule,
    ]
})
export class UsersModule {}
