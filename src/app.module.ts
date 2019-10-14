import {Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "./modules/oauth2/auth.module";
import {UserModule} from "./modules/user/user.module";
import {ScheduleModule} from "nest-schedule";
import {environment} from "./environment/environment";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {RedisService} from "./core/redis.service";
import {AuthInterceptor} from "./core/auth.interceptor";

@Module({
  imports: [
    MongooseModule.forRoot(`${environment.mongoDbUrl}/${environment.collection}`, {useNewUrlParser: true, useUnifiedTopology: true}),
    ScheduleModule.register(),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor
    }
  ],
})
export class AppModule {
}
