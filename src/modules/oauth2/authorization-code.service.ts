import {Injectable} from '@nestjs/common';
import {AuthorizationCode} from './schemas/authorization-code.schema';
import * as crypto from 'crypto';
import {environment} from '../../environment/environment';
import {UserService} from '../user/user.service';
import {RedisService} from '../../core/security/redis.service';
import {GeneralException, NotFoundException} from '../../core/errors/exceptions';
import {AuthCause} from '../../core/errors/cause/auth.cause';
import {AuthCodeExchangeMessage} from './messages/auth-code-exchange.message';

@Injectable()
export class AuthorizationCodeService {

  private static readonly expirationInSeconds = environment.security.authorizationCode.expiresInMinutes * 60;

  constructor(private redisService: RedisService,
              private userService: UserService) {
  }

  async createAuthorizationCode(userId: string, clientId: string, redirectUri: string): Promise<string> {
    const authorizationCode: AuthorizationCode = new AuthorizationCode();
    authorizationCode.value = crypto.randomBytes(environment.security.authorizationCode.length).toString('hex');
    authorizationCode.userId = userId;
    authorizationCode.clientId = clientId;
    authorizationCode.redirectUri = redirectUri;
    await this.redisService.addTokenAndSetExpiration(
        authorizationCode.value,
        authorizationCode,
        'code',
        AuthorizationCodeService.expirationInSeconds);
    return authorizationCode.value;
  }

  async getUserIdForAuthorizationCode(message: AuthCodeExchangeMessage): Promise<string> {
    const authorizationCode = await this.redisService.getToken<AuthorizationCode>(message.code, 'code').catch(() => {
      throw new GeneralException(AuthCause.INVALID_AUTHORIZATION_CODE);
    });
    if (authorizationCode.clientId !== message.clientId || authorizationCode.redirectUri !== message.redirectUri) {
      throw new GeneralException(AuthCause.INVALID_AUTHORIZATION_CODE);
    }
    const user = await this.userService.findById(authorizationCode.userId).catch(() => {
      throw new NotFoundException('User not found!');
    });
    await this.redisService.removeToken(message.code, 'code');
    return user.id;
  }
}
