import OpenAI from "openai";


export interface ChatRequest {
    messages: OpenAI.Chat.ChatCompletionMessage[];
}

export interface ChatResponse {
    success: boolean;
    result: OpenAI.ChatCompletion.Choice;
}