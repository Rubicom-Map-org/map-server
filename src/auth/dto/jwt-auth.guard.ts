import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";


@Injectable()
export class JwtAuthGuard implements CanActivate {

    UNAUTHORIZED_USER_MESSAGE = "user is not authorized"

    constructor(private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const request = context.switchToHttp().getRequest()

        try {
            const tokenParams = request.headers.authorization

            const bearer = tokenParams.split(" ")[0]
            const token = tokenParams.split(" ")[1]

            if (bearer !== "bearer" || !token) {
                throw new UnauthorizedException({message: this.UNAUTHORIZED_USER_MESSAGE})
            }

            const user = this.jwtService.verify(token, { secret: "secret" })

            request.user = user
            return true
        } catch (error) {
            throw new UnauthorizedException(this.UNAUTHORIZED_USER_MESSAGE)
        }

    }

}