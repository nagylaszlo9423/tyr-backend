import {PassportStrategy} from "@nestjs/passport";
import * as Strategy from 'passport-oauth2';
import {StrategyOptions, VerifyFunction} from "passport-oauth2";
import {UserService} from "../../user/user.service";

export class Oauth2Strategy extends PassportStrategy(Strategy) {
  constructor(userService: UserService) {
    super(<StrategyOptions>{
        tokenURL: 'http://localhost/oauth2/token',
        clientID: 'tyr',
        clientSecret: 'tyrpass',
        authorizationURL: 'http://localhost/oauth2/authorize',
        callbackURL: 'http://localhost/login'
      },
      async <VerifyFunction>(accessToken, refreshToken, profile, done) => {
        try {
          done(undefined, await userService.findById(profile.id));
        } catch (err) {
          done(err);
        }
      });
  }
}
