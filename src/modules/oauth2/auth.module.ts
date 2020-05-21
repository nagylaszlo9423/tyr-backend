import {HttpModule, Logger, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {MongooseModule} from '@nestjs/mongoose';
import {AuthService} from './auth.service';
import {AuthorizationCodeService} from './authorization-code.service';
import {TokenService} from './token.service';
import {Oauth2Controller} from './oauth2.controller';
import {UserService} from '../user/user.service';
import {UserSchema} from '../user/user.schema';
import {RedisService} from '../../core/security/redis.service';
import {GroupModule} from '../group/group.module';
import {ModelNames} from '../../db/model-names';
import {CoreModule} from '../../core/core.module';
import {GoogleOauthService} from './social/google-oauth.service';
import {UserModule} from '../user/user.module';
import {FacebookOauthService} from './social/facebook-oauth.service';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'google', session: true}),
    CoreModule,
    HttpModule,
    GroupModule,
    UserModule
  ],
  providers: [
    AuthService,
    AuthorizationCodeService,
    TokenService,
    GoogleOauthService,
    FacebookOauthService,
    RedisService,
    Logger
  ],
  controllers: [
    Oauth2Controller
  ]
})
export class AuthModule {
}
