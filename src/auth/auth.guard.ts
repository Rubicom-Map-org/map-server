import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as dotenv from "dotenv";
import {Observable} from "rxjs";
import * as process from "node:process";
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}

    UNAUTHORIZED_USER_MESSAGE = "user is not authorized"

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        try {
            const tokenParams = request.headers.authorization;

            if (!tokenParams) {
                throw new UnauthorizedException("Authorization header is missing");
            }

            const bearer = tokenParams.split(" ")[0];
            const token = tokenParams.split(" ")[1];
            console.log(token)

            if (!token || bearer !== "Bearer") {
                throw new UnauthorizedException("Invalid token format " + this.UNAUTHORIZED_USER_MESSAGE);
            }

            const user = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY || "secret"
            });
            console.log(user)

            request.user = user

            request["user"] = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException(this.UNAUTHORIZED_USER_MESSAGE);
        }
    }
}
