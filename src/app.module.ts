import {Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {AuthModule} from "./modules/oauth2/auth.module";
import {UserModule} from "./modules/user/user.module";
import {ScheduleModule} from "nest-schedule";
import {environment} from "./environment/environment";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {RedisService} from "./core/security/redis.service";
import {AuthInterceptor} from "./core/security/auth.interceptor";
import {RouteModule} from "./modules/route/route.module";
import {GroupModule} from "./modules/group/group.module";
import {ArticleModule} from "./modules/article/article.module";
import {ResourceModule} from "./modules/resource/resource.module";
import {ContextProviderService} from "./core/services/context-provider.service";

@Module({
  imports: [
    MongooseModule.forRoot(`${environment.mongoDbUrl}/${environment.collection}`, {useNewUrlParser: true, useUnifiedTopology: true}),
    ScheduleModule.register(),
    AuthModule,
    RouteModule,
    GroupModule,
    ArticleModule,
    ResourceModule,
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
