import { Controller, HttpException, HttpStatus, Get } from "@nestjs/common";
import { AppService } from "./app.service";


@Controller('')
export class AppController {

    constructor(private readonly appService: AppService) {

    }

    @Get("")
    async checkServer() {
        try {
            return this.appService.checkServer()
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}