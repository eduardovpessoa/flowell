import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  //app.use(csurf());
  await app.listen(8080);
}
bootstrap();
