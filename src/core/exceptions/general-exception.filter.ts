import {Catch, ArgumentsHost, HttpException, ExceptionFilter, Logger} from '@nestjs/common';
import {Response} from 'express';
import {ErrorResponse} from '../errors/error.response';
import {GeneralCause} from '../errors/cause/general.cause';

@Catch(HttpException)
export class GeneralExceptionFilter implements ExceptionFilter {
  private static readonly loggerContext = 'GeneralExceptionFilter';

  constructor(private logger: Logger) {
    this.logger.setContext(GeneralExceptionFilter.loggerContext);
  }

  catch(exception: HttpException, host: ArgumentsHost): any {
    const response = host.switchToHttp().getResponse<Response>();
    this.logger.error(exception.message);
    try {
      return response.status(exception.getStatus()).json(exception.getResponse());
    } catch (e) {
      return response.status(500).json(new ErrorResponse(GeneralCause.INTERNAL_SERVER_ERROR));
    }
  }
}
