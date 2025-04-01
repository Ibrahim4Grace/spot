import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAttemptsLeftColumn1743406000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE users 
            DROP COLUMN IF EXISTS attempts_left;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE users 
            ADD COLUMN attempts_left integer DEFAULT 3;
        `);
  }
}
