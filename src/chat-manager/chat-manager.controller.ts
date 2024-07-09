import {Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards, Body} from '@nestjs/common';
import {ChatManagerService} from "./chat-manager.service";
import {Chat} from "./enitities/chat.entity";
import {ChatRequest} from "./enitities/chat-request.entity";
import {AuthGuard} from "../auth/auth.guard";
import { CreateChatRequestDto } from 'src/open-ai/dto/create-message.dto';
import { create } from 'domain';
import {UserId} from "../decorators/user-id.decorator";

// @UseGuards(AuthGuard)
@Controller('chat-manager')
export class ChatManagerController {

    constructor(private readonly chatManagerService: ChatManagerService) {
    }

    @Get("/chats/:chatId")
    async getChat(@UserId() userId: string,
                  @Param("chatId") chatId: string): Promise<Chat>
    {
        try {
            return this.chatManagerService.getChatById(userId, chatId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("/chats")
    async getChats(@UserId() userId: string): Promise<Chat[]> {
        try {
            return this.chatManagerService.getChats(userId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("/chats/create-chat")
    async createChat(@UserId() userId: string): Promise<Chat> {
        try {
            return this.chatManagerService.createChat(userId)
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Get("/chat-requests/:chatId/:chatRequestId")
    async getChatRequest(@UserId() userId: string,
                         @Param("chatId") chatId: string,
                         @Param("chatRequestId") chatRequestId: string): Promise<ChatRequest>
    {
        try {
            return this.chatManagerService.getChatRequest(userId, chatId, chatId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("/chat-requests/:chatId")
    async getChatRequests(@UserId() userId: string,
                          @Param("chatId") chatId: string): Promise<ChatRequest[]> {
        try {
            return this.chatManagerService.getChatRequests(userId, chatId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
