import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
ConfigModule.forRoot();

export const config: any = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  migrationsRun: true,
  autoLoadEntities: true,
  logging: true,
  entities: ['entity/*.entity.{.ts,.js}'],
  migrations: ['migration/**/*.{.ts,.js}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
const data = new DataSource(config);
export default data;
