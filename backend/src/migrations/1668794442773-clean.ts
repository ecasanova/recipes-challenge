/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1668794442773 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE area CASCADE;`);
    await queryRunner.query(`TRUNCATE category CASCADE;`);
    await queryRunner.query(`TRUNCATE ingredient CASCADE;`);
    await queryRunner.query(`TRUNCATE recipe CASCADE;`);
    await queryRunner.query(`TRUNCATE recipe_ingredients_ingredient CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
