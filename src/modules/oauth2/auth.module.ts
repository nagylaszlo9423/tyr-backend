import {Logger, MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {MongooseModule} from "@nestjs/mongoose";
import {GoogleOauthMiddleware} from "./middlewares/google-oauth.middleware";
import {AuthService} from "./auth.service";
import {AuthorizationCodeService} from "./authorization-code.service";
import {TokenService} from "./token.service";
import {Oauth2Controller} from "./oauth2.controller";
import {UserService} from "../user/user.service";
import {UserSchema} from "../user/user.schema";
import {RedisService} from "../../core/security/redis.service";
import {GroupModule} from "../group/group.module";


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'User', schema: UserSchema}
    ]),
    PassportModule.register({defaultStrategy: 'google', session: true}),
    GroupModule
  ],
  providers: [
    AuthService,
    AuthorizationCodeService,
    TokenService,
    UserService,
    RedisService,
    Logger
  ],
  controllers: [
    Oauth2Controller
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(GoogleOauthMiddleware)
      .forRoutes('/oauth/google');
  }
}
