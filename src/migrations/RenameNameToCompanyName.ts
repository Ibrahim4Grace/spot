import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameNameToCompanyName implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "borrowers" RENAME COLUMN "name" TO "company_name";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "borrowers" RENAME COLUMN "company_name" TO "name";
        `);
  }
}
