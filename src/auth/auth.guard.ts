import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Observable} from "rxjs";
import * as process from "process";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {
    }

    UNAUTHORIZED_USER_MESSAGE = "user is not authorized"

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest()

        try {
            const tokenParams = request.headers.authorization
            const bearer = tokenParams.split(" ")[0]
            const token = tokenParams.split(" ")[1]

            if (!token || bearer !== "Bearer") {
                throw new UnauthorizedException("Error from not founding token " + this.UNAUTHORIZED_USER_MESSAGE)
            }

            const user = this.jwtService.verify(token,  {
                secret: "secret"
            })

            request.user = user
            return true
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException(this.UNAUTHORIZED_USER_MESSAGE)
        }

    }

}