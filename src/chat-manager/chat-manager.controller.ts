import {Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards, Body} from '@nestjs/common';
import {ChatManagerService} from "./chat-manager.service";
import {Chat} from "./enitities/chat.entity";
import {ChatRequest} from "./enitities/chat-request.entity";
import {AuthGuard} from "../auth/auth.guard";
import {UserId} from "../decorators/user-id.decorator";
import {ApiParam, ApiResponse} from '@nestjs/swagger';
import { ChatManagerRepository } from './chat-manager-repository.abstract';

@UseGuards(AuthGuard)
@Controller('chat-manager')
export class ChatManagerController {

    constructor(private readonly chatManagerService: ChatManagerService) {};
    
    @ApiParam({ name: "chatId" })
    @ApiResponse({ status: HttpStatus.CREATED, type: Chat })
    @Get("chats/:chatId")
    async getChat(
        @UserId() userId: string,
        @Param("chatId") chatId: string
    ): Promise<Chat> {
        return this.chatManagerService.getChatById(userId, chatId);
    }

    @ApiResponse({ status: HttpStatus.OK, type: [Chat] })
    @Get("chats")
    async getChats(@UserId() userId: string): Promise<Chat[]> {
        return this.chatManagerService.getChats(userId);
    }

    @ApiResponse({ status: HttpStatus.OK, type: Chat })
    @Post("chats/create-chat")
    async createChat(@UserId() userId: string): Promise<Chat> {
        return this.chatManagerService.createChat(userId);
    }
    
    @ApiParam({ name: "chatId" })
    @ApiParam({ name: "chatRequestId" })
    @ApiResponse({ status: HttpStatus.OK, type: ChatRequest })
    @Get("chat-requests/:chatId/:chatRequestId")
    async getChatRequest(
        @UserId() userId: string,
        @Param("chatId") chatId: string,
        @Param("chatRequestId") chatRequestId: string
    ): Promise<ChatRequest> {
        return this.chatManagerService.getChatRequest(userId, chatId, chatRequestId);
    }

    @ApiParam({ name: "chatId" })
    @ApiResponse({ status: HttpStatus.OK, type: [ChatRequest] })
    @Get("chat-requests/:chatId")
    async getChatRequests(
        @UserId() userId: string,
        @Param("chatId") chatId: string
    ): Promise<ChatRequest[]> {
        return this.chatManagerService.getChatRequests(userId, chatId);
    }

}
