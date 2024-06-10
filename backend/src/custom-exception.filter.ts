import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();
    const res = exception.getResponse() as { message: string[] };
    response
      .json({
        code: exception.getStatus(),
        msg: res?.message?.join ? res?.message?.join(',') : exception.message,
      })
      .end();
  }
}
