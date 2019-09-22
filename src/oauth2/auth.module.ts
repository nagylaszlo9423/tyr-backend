import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthorizationCodeSchema} from "./schemas/authorization-code.schema";
import {AccessTokenSchema} from "./schemas/access-token.shema";
import {GoogleOauthMiddleware} from "./middlewares/google-oauth.middleware";


@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'AuthorizationCode', schema: AuthorizationCodeSchema},
      {name: 'AccessToken', schema: AccessTokenSchema}
    ]),
    PassportModule.register({defaultStrategy: 'google', session: true})
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(GoogleOauthMiddleware)
      .forRoutes('/oauth/google');
  }
}
