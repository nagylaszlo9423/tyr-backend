import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {environment} from "./environment/environment";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: environment.logLevel
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(environment.port);
}
bootstrap();
