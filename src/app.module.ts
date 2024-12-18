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
import { jwtConstants } from './utils/constants';
import { FirebaseModule } from './firebase/firebase.module';
dotenv.config();

@Module({
    controllers: [],
    providers: []   ,
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        FirebaseModule,
        TypeOrmModule.forRoot(dataSourceOptions),
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: jwtConstants.secretKey,
            secretOrPrivateKey: jwtConstants.secretKey,
            signOptions: { expiresIn: jwtConstants.signOptions.expiresIn },
            global: true
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
