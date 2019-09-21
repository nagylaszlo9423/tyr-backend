import {NestMiddleware} from "@nestjs/common";
import {authenticate} from 'passport';

export class GoogleOauthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    authenticate('google')(req, res, next);
  }
}
