import {NestMiddleware, UnauthorizedException} from "@nestjs/common";
import {Request, Response, NextFunction} from "express";
import {JwtService} from "@nestjs/jwt";


export class JwtTokenMiddleware implements NestMiddleware {

    constructor(private readonly jwtService: JwtService) {}

    use(request: Request, response: Response, next: NextFunction) {

        const token = request.headers.authorization.split(" ")[1]

        if (token) {
            try {
                const user = this.jwtService.decode(token)
                request["user"] = user
                console.log(user)
                next()
            } catch (error) {
                throw new UnauthorizedException("User is not authorized")
            }
        }
    }

}