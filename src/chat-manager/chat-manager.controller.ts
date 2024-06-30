import {Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards, Body} from '@nestjs/common';
import {ChatManagerService} from "./chat-manager.service";
import {Chat} from "./enitities/chat.entity";
import {ChatRequest} from "./enitities/chat-request.entity";
import {AuthGuard} from "../auth/auth.guard";
import { CreateChatRequestDto } from 'src/open-ai/dto/create-message.dto';
import { create } from 'domain';

@UseGuards(AuthGuard)
@Controller('chat-manager')
export class ChatManagerController {

    constructor(private readonly chatManagerService: ChatManagerService) {
    }

    @Get("/chats/:chatId")
    async getChat(@Req() request, @Param("chatId") chatId: string): Promise<Chat> {
        try {
            const userId = request.user.id
            return this.chatManagerService.getChatById(userId, chatId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("/chats")
    async getChats(@Req() request): Promise<Chat[]> {
        try {
            const userId = request.user.id
            return this.chatManagerService.getChats(userId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("/chats/create-chat")
    async createChat(@Req() request): Promise<Chat> {
        try {
            const userId = request.user.id
            return this.chatManagerService.createChat(userId)
        } catch (error) {
            if (error instanceof HttpException) throw Error
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("/chat-requests/:chatId/:chatRequestId")
    async getChatRequest(@Req() request,
                         @Param("chatId") chatId: string,
                         @Param("chatRequestId") chatRequestId: string): Promise<ChatRequest>
    {
        try {
            const userId = request.user.id
            return this.chatManagerService.getChatRequest(userId, chatId, chatId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get("/chat-requests/:chatId")
    async getChatRequests(@Req() request,
                        @Param("chatId") chatId: string): Promise<ChatRequest[]> {
        try {
            const userId = request.user.id
            return this.chatManagerService.getChatRequests(userId, chatId)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post("/chat-requests/create")
    async createChatRequest(@Req() request,
                            @Param("chatId") chatId: string,
                            @Body() createChatRequestDto: CreateChatRequestDto) 
    {
        try {
            const userid = request.user.id
            return this.chatManagerService.createChatRequest(userid, chatId, createChatRequestDto)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}
