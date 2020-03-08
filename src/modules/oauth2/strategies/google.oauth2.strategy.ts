import {PassportStrategy} from '@nestjs/passport';
import {
  StrategyOptionsWithRequest,
  VerifyCallback, VerifyFunctionWithRequest,
} from 'passport-oauth2';
import * as oaut2 from 'passport-oauth2';
import {UserService} from '../../user/user.service';
import {Injectable} from '@nestjs/common';
import {Request} from 'express';

@Injectable()
export class GoogleOauth2Strategy extends PassportStrategy(oaut2.Strategy) {
  constructor(userService: UserService) {
    super(
      {
        tokenURL: 'http://localhost:3001/oauth/token',
        clientID: '732927810796-aqvaaiam2ta2s3idfno9vj44dhpijn4q.apps.googleusercontent.com',
        clientSecret: '6Fj3ax5jKrTQyU97MwmuSTq_',
        authorizationURL: 'http://localhost:3001/oauth/authorize',
        callbackURL: 'http://localhost/login',
      } as StrategyOptionsWithRequest,
      (async (req: Request, accessToken: string, refreshToken: string, results: any, profile: any, verified: VerifyCallback) => {
        try {
          verified(undefined, await userService.findById(profile.id));
        } catch (err) {
          verified(err);
        }
      }) as VerifyFunctionWithRequest);
  }
}
