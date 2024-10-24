import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Req,
    UseGuards,
    UsePipes, ValidationPipe
} from '@nestjs/common';
import {OpenAiService} from "./open-ai.service";
import {AuthGuard} from "../auth/auth.guard";
import {ChatRequest, ChatResponse} from "./interfaces/chat-messaging.interface";
import OpenAI from "openai";
import {ChatManagerService} from "../chat-manager/chat-manager.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {UserId} from "../decorators/user-id.decorator";
import {OpenAiPromptResponseDto} from "./dto/open-ai-request-response.dto";

@Controller('open-ai')
export class OpenAiController {

    constructor(
        private readonly openAiService: OpenAiService,
        private readonly chatManagerService: ChatManagerService
    ) {}

    @UsePipes(ValidationPipe)
    @ApiResponse({status: HttpStatus.CREATED, type: OpenAiPromptResponseDto })
    @ApiParam({ name: "chatId", type: String })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('/chat/:chatId')
    @HttpCode(200)
    async getChatOpenai(
        @UserId() userId: string,
        @Param("chatId") chatId: string,
        @Body() chatRequest: ChatRequest
    ): Promise<OpenAiPromptResponseDto> {
        let isChatNewlyCreated: boolean;
        const chatRequests = await this.chatManagerService.getChatRequests(userId, chatId);
        if (chatRequests.length <= 1) {
            isChatNewlyCreated = true;
        }

        const getMessages = (await this.openAiService.getMessagesData(
            userId,
            chatId,
            chatRequest,
            isChatNewlyCreated
        )) as OpenAI.ChatCompletion;

        const requestAndResponse = { request: chatRequest.messages[0].content, response: getMessages.choices[0].message.content };

        return {
            creatingChatRequest: await this.chatManagerService.createChatRequest(userId, chatId, requestAndResponse),
            openAIResponse: await this.openAiService.getChatOpenaiResponse(getMessages)
        }
    }
}
