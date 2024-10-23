import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1729677401338 implements MigrationInterface {
    name = 'InitialMigration1729677401338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_94f168faad896c0786646fa3d4" UNIQUE ("userId"), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "saved_place" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying, "properties" jsonb, "geometry" jsonb, "userId" uuid, CONSTRAINT "PK_b0697c631b48176f23075b54682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "request" character varying NOT NULL, "response" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "chatId" uuid, CONSTRAINT "PK_6f64232d94659df0614c80ffd79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "database_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "path" character varying NOT NULL, "mimetype" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a48e4fea10786b44d274ba8175" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatarImageUrl" character varying, "isAvatarSet" boolean NOT NULL DEFAULT false, "confirmationCode" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fileId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_903d4d5ec9e6e2754f30b39eae" UNIQUE ("fileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_place" ADD CONSTRAINT "FK_3b9a691fcbed7b873bf4920fc1f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_request" ADD CONSTRAINT "FK_4b4269697aabb98adcee7c9e1de" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_request" ADD CONSTRAINT "FK_61218daedd906fe1ad9f912b92b" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_903d4d5ec9e6e2754f30b39eae1" FOREIGN KEY ("fileId") REFERENCES "database_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_903d4d5ec9e6e2754f30b39eae1"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_52af74c7484586ef4bdfd8e4dbb"`);
        await queryRunner.query(`ALTER TABLE "chat_request" DROP CONSTRAINT "FK_61218daedd906fe1ad9f912b92b"`);
        await queryRunner.query(`ALTER TABLE "chat_request" DROP CONSTRAINT "FK_4b4269697aabb98adcee7c9e1de"`);
        await queryRunner.query(`ALTER TABLE "saved_place" DROP CONSTRAINT "FK_3b9a691fcbed7b873bf4920fc1f"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "database_file"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "chat_request"`);
        await queryRunner.query(`DROP TABLE "saved_place"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }

}
