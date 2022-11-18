/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668795054745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.query(`INSERT INTO category (id,name) VALUES
	 ('0ca735ee-dd66-4365-aa8d-52f2e853d1f4','Beef'),
	 ('a9977f85-6371-40dc-9581-567f846d82df','Side'),
	 ('19bb428b-5027-4361-8d75-28fff468615a','Starter'),
	 ('56ff5bb9-36bc-4617-b9a4-b1295da81ebe','Vegan'),
	 ('5b391a9c-e3a2-44b7-9501-08d584c514b6','Vegetarian'),
	 ('2e5d7a75-f170-4a08-be6a-e1bbb32de66d','Dessert'),
	 ('9f392617-9e07-4b78-9e59-deaa86b58c8b','Chicken'),
	 ('9869614b-f1e2-4cfa-9f97-f6b173aae155','Miscellaneous'),
	 ('d10c7171-ca1b-4fb3-b52c-f1cced8d9442','Pork'),
	 ('b68d9f82-64b7-41f3-90c8-128445774059','Seafood'),
	 ('4ff7038a-eafc-454e-8c34-f72ab3076ecd','Breakfast'),
	 ('48cb3c2d-a9a9-48d8-a16b-f3933fb7cda0','Goat'),
	 ('f71fab01-32c1-4141-91a2-34db7e749dd0','Lamb'),
	 ('ac83e4bd-1227-4166-b081-4ac8445dfc9f','Pasta');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
