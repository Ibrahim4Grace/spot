import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminRole1743407000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO roles (id, name, description, created_at, updated_at)
            VALUES (
                gen_random_uuid(),
                'admin',
                'Administrator role with full access',
                NOW(),
                NOW()
            )
            ON CONFLICT (name) DO NOTHING;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM roles WHERE name = 'admin';
        `);
  }
}
