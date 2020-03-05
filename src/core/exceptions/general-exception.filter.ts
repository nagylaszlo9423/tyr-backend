import {Catch, ArgumentsHost, HttpException, ExceptionFilter} from '@nestjs/common';
import {Response} from 'express';
import {ErrorResponse} from "../errors/error.response";

@Catch(HttpException)
export class GeneralExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const response = host.switchToHttp().getResponse<Response>();
    try {
      return response.status(exception.getStatus()).json(exception.getResponse());
    } catch (e) {
      return response.status(500).json(new ErrorResponse('INTERNAL_SERVER_ERROR'));
    }
  }
}
