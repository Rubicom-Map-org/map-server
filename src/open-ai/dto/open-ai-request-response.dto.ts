import { ApiProperty } from "@nestjs/swagger";
import { ChatRequest } from "../../chat-manager/enitities/chat-request.entity";
import OpenAI from "openai";

export class OpenAiMessageDto {
    
    @ApiProperty()
    readonly role: string;
    
    @ApiProperty()
    readonly content: string;
    
    @ApiProperty()
    readonly refusal: null | string;
}

export class ChatCompletionChoiceResultDto {
    
    @ApiProperty()
    readonly index: number;
    
    @ApiProperty({ type: OpenAiMessageDto })
    readonly message: OpenAiMessageDto;
    
    @ApiProperty()
    readonly logrobs: string | null;
    
    @ApiProperty()
    finish_reason: string;
}

export class ChatResponseDto {
    
    @ApiProperty()
    readonly success: boolean;
    
    @ApiProperty({ type: ChatCompletionChoiceResultDto })
    readonly result: OpenAI.ChatCompletion.Choice;
}

export class OpenAiPromptResponseDto {
    
    @ApiProperty({ type: ChatRequest })
    readonly creatingChatRequest: ChatRequest;
    
    @ApiProperty({ type: ChatResponseDto })
    readonly openAIResponse: ChatResponseDto;
}
