import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {environment} from "./environment/environment";
import {GeneralExceptionFilter} from "./core/general-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: environment.logLevel
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GeneralExceptionFilter());
  await app.listen(environment.port);
}
bootstrap();
