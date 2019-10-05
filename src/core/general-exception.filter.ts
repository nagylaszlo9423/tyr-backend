import {Catch, ArgumentsHost, HttpException, ExceptionFilter} from '@nestjs/common';
import {Response} from 'express';
import {ErrorResponse} from "../api/errors/error.response";

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    console.log('caught', exception);
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof HttpException) {
      const ex = exception as HttpException;
      return response.status(ex.getStatus()).json(ex.getResponse());
    }

    return response.status(500).json(new ErrorResponse('INTERNAL_SERVER_ERROR'));
  }
}
