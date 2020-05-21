import {CallHandler, NestInterceptor} from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import {ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {RedisService} from './redis.service';
import {AccessToken} from '../../modules/oauth2/schemas/access-token.shema';
import {Request, Response} from 'express';
import {ErrorResponse} from '../errors/error.response';
import {GeneralCause} from '../errors/cause/general.cause';
import {environment} from '../../environment/environment';
import {finalize} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  private static readonly loggerContext = 'AuthInterceptor';

  constructor(private redisService: RedisService,
              private logger: Logger) {
    this.logger.setContext(AuthInterceptor.loggerContext)
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (environment.logLevel && (environment.logLevel as string[]).indexOf('debug') > -1) {
      this.logger.debug(AuthInterceptor.requestToDebugMessage(request));
    }

    if (AuthInterceptor.isSecured(request.url)) {
      try {
        await this.authorize(request);
      } catch (e) {
        this.logger.error(e);
        response.status(401).json(new ErrorResponse(GeneralCause.UNAUTHORIZED));
        return;
      }
    }
    return next.handle();
  }

  private async authorize(request: Request) {
    const tokenValue = request.headers.authorization;
    if (tokenValue && (typeof tokenValue === 'string')) {
      const token: AccessToken = await this.redisService.getToken(tokenValue, 'access');

      if (token) {
        request.headers['User-Id'] = token.userId;
      } else {
        throw new Error('Invalid token');
      }
    } else {
      throw new Error('Invalid token');
    }
  }

  private static isSecured(url: string): boolean {
    return url.indexOf('/oauth') === -1 && url.indexOf('/public') === -1;
  }

  private static requestToDebugMessage(req: Request): any {
    return {
      url: req.url,
      query: req.query,
      body: req.body
    };
  }
}
