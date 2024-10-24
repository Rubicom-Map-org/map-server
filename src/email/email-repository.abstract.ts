
export abstract class EmailRepository {
    abstract sendVerificationCodeByEmail(email: string, verificationCode: string): Promise<void>;
}