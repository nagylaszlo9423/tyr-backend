import {Injectable} from "@nestjs/common";
import {AuthorizationCode} from "./schemas/authorization-code.schema";
import * as crypto from 'crypto'
import {environment} from "../environment/environment";
import {UserService} from "../user/user.service";
import {RedisService} from "../core/redis.service";
import {InvalidAuthorizationCode, NotFoundException} from "../api/errors/errors";


@Injectable()
export class AuthorizationCodeService {

  private static readonly expirationInSeconds = environment.authorizationCode.expiresInMinutes * 60;

  constructor(private redisService: RedisService,
              private userService: UserService) {
  }

  async createAuthorizationCode(userId: string, clientId: string, redirectUri: string): Promise<string> {
    const authorizationCode: AuthorizationCode = new AuthorizationCode();
    authorizationCode.value = crypto.randomBytes(environment.authorizationCode.length).toString('hex');
    authorizationCode.userId = userId;
    authorizationCode.clientId = clientId;
    authorizationCode.redirectUri = redirectUri;
    return (await this.redisService.addTokenAndSetExpiration(authorizationCode.value, authorizationCode, 'code', AuthorizationCodeService.expirationInSeconds)).value;
  }

  async getUserIdForAuthorizationCode(code: string, clientId: string, redirectUri: string): Promise<string> {
    const authorizationCode = await this.redisService.getToken<AuthorizationCode>(code, 'code').catch(() => {
      throw new InvalidAuthorizationCode();
    });
    if (authorizationCode.clientId != clientId || authorizationCode.redirectUri != redirectUri) {
      throw new InvalidAuthorizationCode();
    }
    const user = await this.userService.findById(authorizationCode.userId).catch(() => {
      throw new NotFoundException('User not found!');
    });
    await this.redisService.removeToken(code, 'code');
    return user.id;
  }
}
