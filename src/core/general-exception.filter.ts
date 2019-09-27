import {Catch, ArgumentsHost, HttpException, InternalServerErrorException, ExceptionFilter} from '@nestjs/common';
import {Response} from 'express';

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof HttpException) {
      const ex = exception as HttpException;
      return response.status(ex.getStatus()).json(ex.getResponse());
    }

    return response.status(500).json(new InternalServerErrorException().getResponse());
  }
}
