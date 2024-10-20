import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1729463670148 implements MigrationInterface {
    name = 'UpdateUserTable1729463670148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "confirmationCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "confirmationCode"`);
    }

}
