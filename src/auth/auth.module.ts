import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {TokensModule} from "../tokens/tokens.module";
import * as dotenv from "dotenv";
import { EmailModule } from '../email/email.module';
dotenv.config();

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        forwardRef(() => UsersModule),
        TokensModule,
        JwtModule,
        EmailModule
    ],
    exports: [AuthService]
})
export class AuthModule {}
