import {Logger, Module, OnApplicationBootstrap} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthModule} from './modules/oauth2/auth.module';
import {UserModule} from './modules/user/user.module';
import {ScheduleModule} from 'nest-schedule';
import {environment} from './environment/environment';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {RedisService} from './core/security/redis.service';
import {AuthInterceptor} from './core/security/auth.interceptor';
import {GroupModule} from './modules/group/group.module';
import {ArticleModule} from './modules/article/article.module';
import {ResourceModule} from './modules/resource/resource.module';
import {PathModule} from './modules/path/path.module';
import {mongooseOptions} from './mongoose-options';

@Module({
  imports: [
    MongooseModule.forRoot(environment.getConnectionString(), mongooseOptions),
    ScheduleModule.register(),
    AuthModule,
    PathModule,
    GroupModule,
    ArticleModule,
    ResourceModule,
    UserModule
  ],
  providers: [
    Logger,
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor
    }
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private logger: Logger) {
  }

  onApplicationBootstrap(): any {
    this.logger.log(`Current environment: ${environment.env}`);
  }
}
