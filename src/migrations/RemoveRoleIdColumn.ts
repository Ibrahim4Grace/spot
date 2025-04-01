import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRoleIdColumn implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN IF EXISTS "role_id";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" ADD COLUMN "role_id" uuid;
        `);
  }
}
