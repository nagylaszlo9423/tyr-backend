import {Logger, MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthorizationCodeSchema} from "./schemas/authorization-code.schema";
import {AccessTokenSchema} from "./schemas/access-token.shema";
import {GoogleOauthMiddleware} from "./middlewares/google-oauth.middleware";
import {AuthService} from "./auth.service";
import {AuthorizationCodeService} from "./authorization-code.service";
import {TokenService} from "./token.service";
import {Oauth2Controller} from "./oauth2.controller";
import {UserService} from "../user/user.service";
import {RefreshTokenSchema} from "./schemas/refresh-token.schema";
import {UserSchema} from "../user/user.schema";


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'AuthorizationCode', schema: AuthorizationCodeSchema},
      {name: 'AccessToken', schema: AccessTokenSchema},
      {name: 'RefreshToken', schema: RefreshTokenSchema},
      {name: 'User', schema: UserSchema}
    ]),
    PassportModule.register({defaultStrategy: 'google', session: true})
  ],
  providers: [
    AuthService,
    AuthorizationCodeService,
    TokenService,
    UserService,
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
