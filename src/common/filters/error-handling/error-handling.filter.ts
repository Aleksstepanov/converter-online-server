import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { TErrorResponse } from './types';

@Catch(HttpException)
export class ErrorHandlingFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse: TErrorResponse =
      exception.getResponse() as TErrorResponse;

    const message = errorResponse.message || 'An unexpected error occurred';
    const statusCode = errorResponse.statusCode || status;

    if (response && typeof response.json === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      response.status(statusCode).json({
        statusCode,
        message,
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      response.status(statusCode).send({
        statusCode,
        message,
      });
    }
  }
}
