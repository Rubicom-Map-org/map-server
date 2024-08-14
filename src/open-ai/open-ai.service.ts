import {BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger} from '@nestjs/common';
import OpenAI from "openai";
import * as process from "node:process";
import * as dotenv from "dotenv";
import {ChatRequest, ChatResponse} from "./interfaces/chat-messaging.interface";
import {UsersService} from "../users/users.service";
import {ChatManagerService} from "../chat-manager/chat-manager.service";
const mapJSON = require("../../map.json");
import { compressToBase64 } from "lz-string";
dotenv.config();



@Injectable()
export class OpenAiService {

    private readonly openAIService: OpenAI
    private readonly logger = new Logger(OpenAiService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly chatManagerService: ChatManagerService
    )
    {
        this.openAIService = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async getMessagesData(
        userId: string,
        chatId: string,
        request: ChatRequest,
        isChatNewlyCreated: boolean = true
    ): Promise<OpenAI.ChatCompletion>
    
    {
        try {
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
            })
            
            const totalTokens = this.calculateTokenCount(messagesWithJSON);
            const MAX_TOKENS = 16385;
            
            if (totalTokens > MAX_TOKENS) {
                this.logger.error(`Message length exceeds the token limit. Total tokens: ${totalTokens}`);
                throw new BadRequestException("Message length exceeds the token limit.");
            }
            
            return this.openAIService.chat.completions.create({
                model: process.env.OPENAI_API_MODEL,
                messages: messagesWithJSON,
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }

    async getChatOpenaiResponse(message: OpenAI.ChatCompletion): Promise<ChatResponse>
    {
        try {
            return {
                success: true,
                result: message?.choices?.length && message?.choices[0],
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error
            }
            throw new InternalServerErrorException(error.message)
        }
    }
    
    private calculateTokenCount(messages: any[]): number
    {
        return messages.reduce((acc, message) => acc + this.estimateTokens(message.content), 0);
    }
    
    private estimateTokens(text: string): number
    {
        const tokensPerWord = 4;
        return Math.ceil(text.length / tokensPerWord);
    }

}
