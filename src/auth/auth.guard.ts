import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as dotenv from "dotenv";
import {Observable} from "rxjs";
import * as process from "node:process";
import {ExceptionMessage} from "../utils/exception-message.enum";
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            const tokenParams = request.headers.authorization;
            if (!tokenParams) {
                throw new UnauthorizedException("Authorization header is missing");
            }

            const [bearer, token] = tokenParams.split(" ");
            if (!token || bearer !== "Bearer") {
                throw new UnauthorizedException("Invalid token format " + ExceptionMessage.UNAUTHORIZED);
            }

            const user = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY || "secret"
            });

            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException(ExceptionMessage.UNAUTHORIZED);
        }
    }
}
