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

    constructor(private readonly openAiService: OpenAiService) {}

    @UsePipes(ValidationPipe)
    @ApiResponse({status: HttpStatus.CREATED, type: OpenAiPromptResponseDto })
    @ApiParam({ name: "chatId", type: String })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post('chat/:chatId')
    @HttpCode(200)
    async createOpenAIPrompt(
        @UserId() userId: string,
        @Param("chatId") chatId: string,
        @Body() chatRequest: ChatRequest
    ): Promise<OpenAiPromptResponseDto> {
        return this.openAiService.createOpenAIPrompt(userId, chatId, chatRequest);
    }
}
