import {Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "./oauth2/auth.module";
import {UserModule} from "./user/user.module";
import {ScheduleModule} from "nest-schedule";
import {environment} from "./environment/environment";

@Module({
  imports: [
    MongooseModule.forRoot(`${environment.mongoDbUrl}/${environment.collection}`),
    ScheduleModule.register(),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
