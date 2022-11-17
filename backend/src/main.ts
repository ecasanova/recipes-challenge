import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TypeORMExceptionFilter } from './utils/typeorm-exceptions.filter';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
const SERVER = process.env.NODE_ENV == 'production' ? '::' : 'localhost';
const PORT = process.env.API_PORT || 3000;

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  app.useGlobalFilters(new TypeORMExceptionFilter());
  const options = new DocumentBuilder()
    .setTitle('Recipes API')
    .setDescription('Recipes API')
    .setVersion('1.1')
    .build();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Recipes API',
  };
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, customOptions);
  app.enableCors({
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization, apiKey',
  });

  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/static/',
    index: false,
  });
  await app.listen(Number(PORT), SERVER);

  console.log(`------------------------------------------------------`);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Enviroment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DB_HOST}`);
  console.log(`------------------------------------------------------`);
}

bootstrap();
