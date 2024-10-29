import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Chat} from "./enitities/chat.entity";
import { InsertResult, Repository } from 'typeorm';
import {ChatRequest} from "./enitities/chat-request.entity";
import {CreateChatRequestDto} from "../open-ai/dto/create-message.dto";
import {UsersService} from "../users/users.service";
import {ExceptionMessage} from "../utils/exception-message.enum";

@Injectable()
export class ChatManagerService {

    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        @InjectRepository(ChatRequest)
        private readonly chatRequestRepository: Repository<ChatRequest>,
        private readonly usersService: UsersService
    ) {}

    async createChat(userId: string): Promise<Chat> {
        const user = await this.usersService.getUserById(userId);

        const chatInsertionResult: InsertResult = await this.chatRepository
            .createQueryBuilder()
            .insert()
            .into(Chat)
            .values({ user })
            .returning("id")
            .execute();

        const chat =  chatInsertionResult.raw[0];
        return await this.chatRepository.save(chat);
    }

    async getChatById(userId: string, chatId: string): Promise<Chat> {
        const chat =  await this.chatRepository
            .createQueryBuilder("chat")
            .innerJoin("chat.user", "user")
            .where("user.id = :userId", { userId })
            .andWhere("chat.id = :chatId", { chatId: chatId })
            .getOne();

        if (!chat) throw new NotFoundException(ExceptionMessage.CHAT_NOT_FOUND);
        return chat;
    }

    async getChats(userId: string): Promise<Chat[]> {
        const chats =  await this.chatRepository
            .createQueryBuilder("chat")
            .innerJoin("chat.user", "user")
            .where("user.id = :userId", { userId })
            .getMany();

        if (!chats) {
            throw new NotFoundException("Not found");
        }
        return chats;
    }

    async createChatRequest(
        userId: string,
        chatId: string,
        createChatRequestDto: CreateChatRequestDto
    ): Promise<ChatRequest> {
        const user = await this.usersService.getUserById(userId)
        const chat = await this.getChatById(userId, chatId)

        const chatRequestInsertResult: InsertResult = await this.chatRequestRepository
            .createQueryBuilder()
            .insert()
            .into(ChatRequest)
            .values({
                ...createChatRequestDto,
                user,
                chat
            })
            .execute();

        const chatRequest = chatRequestInsertResult.raw[0];
        return await this.chatRequestRepository.save(chatRequest);
    }

    async getChatRequest(
        userId: string,
        chatId: string,
        chatRequestId: string
    ): Promise<ChatRequest> {
        const chatRequest = await this.chatRequestRepository
            .createQueryBuilder("chatRequest")
            .innerJoin("chatRequest.user", "user")
            .innerJoin("chatRequest.chat", "chat")
            .where("chatRequest.id = :id", { id: chatRequestId })
            .andWhere("chatRequest.chat.id = :chatId", { chatId })
            .andWhere("chatRequest.user.id = :userId", { userId })
            .getOne();

        if (!chatRequest) {
            throw new NotFoundException(ExceptionMessage.CHAT_NOT_FOUND);
        }
        return chatRequest;
    }

    async getChatRequests(userId: string, chatId: string): Promise<ChatRequest[]> {
        const chatRequests =  await this.chatRequestRepository
            .createQueryBuilder("chatRequest")
            .innerJoin("chatRequest.chat", "chat")
            .innerJoin("chatRequest.user", "user")
            .where("chatRequest.user.id = :userId", { userId })
            .andWhere("chatRequest.chat.id = :chatId", { chatId })
            .getMany();

        if (!chatRequests) {
            throw new NotFoundException("Not found");
        }
        return chatRequests;
    }
}
