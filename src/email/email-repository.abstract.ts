
export abstract class EmailRepository {
    abstract sendMessageToOwners(email: string, message: string): Promise<void>;
    abstract sendVerificationCodeByEmail(email: string): Promise<void>;
}