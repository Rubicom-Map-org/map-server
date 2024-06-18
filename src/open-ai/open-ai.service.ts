import {Injectable  } from '@nestjs/common';
import * as dotenv from "dotenv";
import OpenAI from "openai";
import * as process from "node:process";
import {ChatRequest, ChatResponse} from "./interfaces/chat-messaging.interface";
import {UsersService} from "../users/users.service";
dotenv.config();
const mapJSON = require("../../map.json");


@Injectable()
export class OpenAiService {

    private readonly openAIService: OpenAI

    constructor(private readonly usersService: UsersService) {
        this.openAIService = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async getMessagesData(userId: string, request: ChatRequest): Promise<OpenAI.ChatCompletion> {
        const user = await this.usersService.getUserById(userId)

        const messagesWithJSON = request.messages.map(message => {
            return {
                ...message,
                content: `${message.content}\n\n${JSON.stringify(mapJSON)}`
            }
        })

        return this.openAIService.chat.completions.create({
            model: process.env.OPENAI_API_MODEL,
            messages: messagesWithJSON,
        });
    }

    getChatOpenaiResponse(message: OpenAI.ChatCompletion): ChatResponse {
        return {
            success: true,
            result: message?.choices?.length && message?.choices[0],
        };
    }

}
