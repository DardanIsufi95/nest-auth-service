import { MigrationInterface, QueryRunner } from "typeorm";

export class Test21743964718278 implements MigrationInterface {
    name = 'Test21743964718278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
    }

}
