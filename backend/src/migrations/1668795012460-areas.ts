/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1668795012460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.query(`INSERT INTO area (id,name) VALUES
	 ('f193f2b5-5edd-4ce2-b8e8-86767ac52fd6','Greek'),
	 ('1100ed2c-9aca-4206-a859-862c7dce0b7f','Irish'),
	 ('9c1f1968-b940-4297-8af2-6d4c90718c5c','Italian'),
	 ('aa65866f-6df7-452f-b2e0-4fcb1a9a0e6d','Jamaican'),
	 ('6e8bb166-bbf2-43cd-9d1a-9703fcdf23e8','Japanese'),
	 ('92ef4411-ed52-44ea-b465-9b0d8941211b','Chinese'),
	 ('d03ccf7e-4432-4bf9-ad37-993aa7e7b8c0','Malaysian'),
	 ('18b57bf0-b7b4-4c65-9b27-0e67f1ede2ca','Kenyan'),
	 ('e2b8d3fd-68e4-4642-a2f2-f7d93361ee2e','Mexican'),
	 ('c929e154-f42f-4ad9-a064-b53986015f4d','Moroccan'),
	 ('bb396b6e-e7dd-4c3a-ae52-9bcb352e6e2b','French'),
	 ('fb674677-0fed-4453-9971-f69e71f79ceb','Polish'),
	 ('3e459811-d0c2-4188-8263-f2719a3458b0','Portuguese'),
	 ('a4e704ef-d012-41dd-9b19-58ba68891d26','Russian'),
	 ('0177594f-8dec-43af-b5c0-f9f5541e3265','Indian'),
	 ('530e427a-1b8d-47bb-ad4f-ebcaf4effd38','Canadian'),
	 ('1ee74999-ef20-4e0f-b718-6aac862c8088','Croatian'),
	 ('a2358739-939f-4869-8f07-0420bdbe5005','American'),
	 ('7f4161b9-70a3-4b84-99d4-8195f47f7d7c','Egyptian'),
	 ('d24bab5f-4f74-4309-9254-5df88b8d5726','British'),
	 ('7cc3087d-d9ec-4956-a225-8ee84eff4a6b','Dutch'),
	 ('be5ddd58-019f-4bcd-aae8-e3d295990d9d','Spanish'),
	 ('79fce666-869a-4ea1-9780-06c213e269c6','Thai'),
	 ('feecd89f-8d7c-4007-9dc2-bcc2423c6e27','Tunisian'),
	 ('6496a6c6-960c-4cb7-9c71-1e7f30ae369c','Turkish'),
	 ('6a5de6f8-c4c8-4d25-a618-51f54db9dd54','Unknown'),
	 ('e98f1b60-6c56-4f46-a2cb-c00cae6cc59e','Vietnamese');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
