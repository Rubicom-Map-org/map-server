import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Chat} from "./enitities/chat.entity";
import {Repository} from "typeorm";
import {ChatRequest} from "./enitities/chat-request.entity";
import {CreateChatRequestDto} from "../open-ai/dto/create-message.dto";
import {UsersService} from "../users/users.service";

@Injectable()
export class ChatManagerService {

    constructor(@InjectRepository(Chat)
                private readonly chatRepository: Repository<Chat>,
                @InjectRepository(ChatRequest)
                private readonly chatRequestRepository: Repository<ChatRequest>,
                private readonly usersService: UsersService) {
    }

    async createChat(userId: string): Promise<Chat> {
        const user = await this.usersService.getUserById(userId)
        const chat = this.chatRepository.create()
        chat.user = user
        return await this.chatRepository.save(chat)
    }

    async getChatById(userId: string, chatId: string): Promise<Chat> {
        const user = await this.usersService.getUserById(userId)

        return await this.chatRepository.findOne({
            where: { id: chatId, user: user }
        })
    }

    async getChats(userId: string): Promise<Chat[]> {
        const user = await this.usersService.getUserById(userId)

        return await this.chatRepository.find({
            where: { user: user }
        })
    }

    async createChatRequest(userId: string, chatId: string, createChatRequestDto: CreateChatRequestDto): Promise<ChatRequest> {
        const user = await this.usersService.getUserById(userId)
        const chat = await this.getChatById(userId, chatId)

        const chatRequest =  this.chatRequestRepository.create({
            ...createChatRequestDto,
            user: user,
            chat: chat
        })

        return await this.chatRequestRepository.save(chatRequest)
    }

    async getChatRequest(userId: string, chatId: string, chatRequestId: string): Promise<ChatRequest> {
        const user = await this.usersService.getUserById(userId)
        const chat = await this.getChatById(userId, chatId)

        return this.chatRequestRepository.findOne({
            where: {
                id: chatRequestId,
                user: user,
                chat: chat
            }
        })

    }

    async getChatRequests(userId: string, chatId: string): Promise<ChatRequest[]> {
        const user = await this.usersService.getUserById(userId)
        const chat = await this.getChatById(userId, chatId)

        return await this.chatRequestRepository.find({
            where: { user: user, chat: chat }
        })
    }

}
