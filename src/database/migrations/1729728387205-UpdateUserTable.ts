import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1729728387205 implements MigrationInterface {
    name = 'UpdateUserTable1729728387205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAccountVerified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAccountVerified"`);
    }

}
