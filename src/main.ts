import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {environment} from "./environment/environment";
import {GeneralExceptionFilter} from "./core/general-exception.filter";
import * as helmet from 'helmet';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: environment.logLevel
  });
  if (process.env.NODE_ENV === 'production') {
    app.use(csurf());
    app.use(helmet());
  } else {
    app.enableCors();
  }
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GeneralExceptionFilter());
  await app.listen(environment.port);
}
bootstrap();
