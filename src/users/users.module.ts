import {forwardRef, Module} from '@nestjs/common';
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
        TypeOrmModule.forFeature([User])
    ],
    exports: [
        UsersService,
        TypeOrmModule,
    ]
})
export class UsersModule {}
