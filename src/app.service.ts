import { Injectable } from "@nestjs/common";


@Injectable()
export class AppService {

    async checkServer() {
        return "Server is running"
    }

}