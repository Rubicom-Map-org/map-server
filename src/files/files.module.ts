import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DatabaseFile} from "./files.entity";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import process from "node:process";
import { JwtModule } from '@nestjs/jwt';

@Module({
    providers: [FilesService],
    controllers: [FilesController],
    imports: [
        TypeOrmModule.forFeature([DatabaseFile]),
        UsersModule,
        AuthModule,
    ],
    exports: [
        TypeOrmModule,
        FilesService
    ]
})
export class FilesModule {}
