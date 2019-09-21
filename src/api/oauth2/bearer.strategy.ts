import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {IStrategyOptions, IVerifyOptions, Strategy, VerifyFunction} from 'passport-http-bearer'

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super(<IStrategyOptions> {

    },
     <VerifyFunction>(token, done) => {

     });
  }

  authenticate(req: Request, options?: Object): void {

  }
}
