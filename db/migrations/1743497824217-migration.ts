import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1743497824217 implements MigrationInterface {
    name = 'Migration1743497824217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" double precision NOT NULL, "investment_date" date NOT NULL, "investorId" uuid, "guaranteeId" uuid, CONSTRAINT "PK_a1263853f1a4fb8b849c1c9aff4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."capital_requests_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "capital_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "amount" double precision NOT NULL, "purpose" character varying NOT NULL, "status" "public"."capital_requests_status_enum" NOT NULL DEFAULT 'PENDING', "approval_date" date, "borrowerId" uuid, "approvedById" uuid, CONSTRAINT "PK_fe681f57e6fd0f245633b16eb24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`);
        await queryRunner.query(`ALTER TABLE "guarantees" ADD "is_exposed" boolean`);
        await queryRunner.query(`ALTER TABLE "guarantees" ADD "guarantorId" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user', 'borrower', 'guarantor', 'investor', 'officer')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "verification_level" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "borrower_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fbc06e934df7582d636e8b5bd85" UNIQUE ("borrower_id")`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_93332d5e49cd494527409e0be3d" FOREIGN KEY ("investorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investments" ADD CONSTRAINT "FK_680f2c087c8e0cf918a6153645f" FOREIGN KEY ("guaranteeId") REFERENCES "guarantees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "guarantees" ADD CONSTRAINT "FK_4962351810a61d93c7f5df41945" FOREIGN KEY ("guarantorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "capital_requests" ADD CONSTRAINT "FK_0b79a5125333c6b8b93e6cb5f34" FOREIGN KEY ("borrowerId") REFERENCES "borrowers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "capital_requests" ADD CONSTRAINT "FK_ed11ceb9fe8222d99a2bb4239f5" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_fbc06e934df7582d636e8b5bd85" FOREIGN KEY ("borrower_id") REFERENCES "borrowers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_fbc06e934df7582d636e8b5bd85"`);
        await queryRunner.query(`ALTER TABLE "capital_requests" DROP CONSTRAINT "FK_ed11ceb9fe8222d99a2bb4239f5"`);
        await queryRunner.query(`ALTER TABLE "capital_requests" DROP CONSTRAINT "FK_0b79a5125333c6b8b93e6cb5f34"`);
        await queryRunner.query(`ALTER TABLE "guarantees" DROP CONSTRAINT "FK_4962351810a61d93c7f5df41945"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_680f2c087c8e0cf918a6153645f"`);
        await queryRunner.query(`ALTER TABLE "investments" DROP CONSTRAINT "FK_93332d5e49cd494527409e0be3d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fbc06e934df7582d636e8b5bd85"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "borrower_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verification_level"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "guarantorId"`);
        await queryRunner.query(`ALTER TABLE "guarantees" DROP COLUMN "is_exposed"`);
        await queryRunner.query(`CREATE TYPE "public"."users_user_type_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_type" "public"."users_user_type_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`DROP TABLE "capital_requests"`);
        await queryRunner.query(`DROP TYPE "public"."capital_requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "investments"`);
    }

}
