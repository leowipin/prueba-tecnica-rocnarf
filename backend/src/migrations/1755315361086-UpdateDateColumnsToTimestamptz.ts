import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDateColumnsToTimestamptz1755315361086 implements MigrationInterface {
    name = 'UpdateDateColumnsToTimestamptz1755315361086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
