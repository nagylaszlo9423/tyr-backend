import {CallHandler, NestInterceptor} from "@nestjs/common/interfaces/features/nest-interceptor.interface";
import {ExecutionContext, Injectable, Logger} from "@nestjs/common";
import {IncomingHttpHeaders} from "http";
import {RedisService} from "./redis.service";
import {AccessToken} from "../oauth2/schemas/access-token.shema";
import {Request, Response} from "express";
import {ErrorResponse} from "../api/errors/error.response";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private redisService: RedisService,
              private logger: Logger) {
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    if(AuthInterceptor.isSecured(request.url)) {
      try {
        await this.authorize(request.headers);
      } catch (e) {
        this.logger.error(e, undefined,'AuthInterceptor');
        return response.status(401).json(new ErrorResponse('UNAUTHORIZED'));
      }
    }
    return next.handle();
  }

  private async authorize(headers: IncomingHttpHeaders) {
    const tokenValue = headers['Authorization'];
    if (tokenValue && (typeof tokenValue === 'string')) {
      const token: AccessToken = await this.redisService.getToken(tokenValue, 'access');
      if (token) {
        headers['User-Id'] = token.userId;
      }
    } else {
      throw new Error('Invalid token');
    }
  }

  private static isSecured(url: string): boolean {
    return url.indexOf('/oauth') === -1 && url.indexOf('/public') === -1;
  }
}
