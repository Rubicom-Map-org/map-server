import {BadRequestException, Injectable, Logger} from '@nestjs/common';
import OpenAI from "openai";
import * as process from "node:process";
import * as dotenv from "dotenv";
import {ChatRequest} from "./interfaces/chat-messaging.interface";
import {UsersService} from "../users/users.service";
const mapJSON = require("../../map.json");
import { compressToBase64 } from "lz-string";
import {ChatResponseDto} from "./dto/open-ai-request-response.dto";
import { ConfigService } from '@nestjs/config';
dotenv.config();

@Injectable()
export class OpenAiService {

    private readonly openAIService: OpenAI
    private readonly logger = new Logger(OpenAiService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) {
        this.openAIService = new OpenAI({
            apiKey: this.configService.get<string>("OPENAI_API_KEY"),
        });
    }

    async getMessagesData(
        userId: string,
        chatId: string,
        request: ChatRequest,
        isChatNewlyCreated: boolean = true
    ): Promise<OpenAI.ChatCompletion> {
        const user = await this.usersService.getUserById(userId)
        const compressedMapJSONData = compressToBase64(JSON.stringify(mapJSON.features));
            
        const messagesWithJSON = request.messages.map(message => {

            const trimmedContent = message.content.slice(0, 1000);
            return {
                ...message,
                content: `
                    content: ${trimmedContent}\n\n,
                    locationsLink: ${process.env.MAPBOX_LVIV_LOCATIONS_API},
                    prompt: use this link to give responses when user asks about locations in Lviv,
                    warning: never share this link!!!    
                `,
            }
        });
            
        const totalTokens = this.calculateTokenCount(messagesWithJSON);
        const MAX_TOKENS = 16385;
            
        if (totalTokens > MAX_TOKENS) {
            this.logger.error(`Message length exceeds the token limit. Total tokens: ${totalTokens}`);
            throw new BadRequestException("Message length exceeds the token limit.");
        }
            
        return this.openAIService.chat.completions.create({
            model: this.configService.get<string>("OPENAI_API_MODEL"),
            messages: messagesWithJSON,
        });
    }

    async getChatOpenaiResponse(message: OpenAI.ChatCompletion): Promise<ChatResponseDto> {
        return { success: true, result: message?.choices?.length && message?.choices[0] };
    }
    
    private calculateTokenCount(messages: any[]): number {
        return messages.reduce((acc, message) => acc + this.estimateTokens(message.content), 0);
    }
    
    private estimateTokens(text: string): number {
        const tokensPerWord = 4;
        return Math.ceil(text.length / tokensPerWord);
    }
}
