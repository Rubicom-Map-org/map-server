import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {dataSourceOptions} from "./database/data-source";
import { EmailModule } from './email/email.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { SavedPlacesModule } from './saved-places/saved-places.module';
import * as dotenv from "dotenv";
import * as process from "node:process";
import { TokensModule } from './tokens/tokens.module';
import {JwtModule} from "@nestjs/jwt";
import { ChatManagerModule } from './chat-manager/chat-manager.module';
import { FilesModule } from './files/files.module';
import {MulterModule} from "@nestjs/platform-express";
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from "node:path";
import {LastVisitedPlacesModule} from "./last-visited-places/last-visited-places.module";
dotenv.config();

@Module({
    controllers: [],
    providers: []   ,
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot(dataSourceOptions),
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_KEY') || 'secret',
                signOptions: { expiresIn: '336h' },
            }),
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, "..", "uploads")
        }),
        UsersModule,
        AuthModule,
        EmailModule,
        OpenAiModule,
        SavedPlacesModule,
        TokensModule,
        ChatManagerModule,
        FilesModule,
        LastVisitedPlacesModule,
        MulterModule.register({ dest: "./uploads" })],
    exports: [
        TypeOrmModule,
        JwtModule
    ]
})
export class AppModule {}
