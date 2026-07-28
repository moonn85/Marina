import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppMessage } from './AppMessage';
import { StandardResponse } from './StandardResponse';
import message_key from './MessageKey';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let code = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = AppMessage.INTERNAL_SERVER_ERROR;
    let reason_code: string | null = null;

    console.error('=== EXCEPTION CAUGHT ===');
    console.error('Exception type:', exception?.constructor?.name || 'Unknown');
    console.error('Exception:', exception);
    console.error(
      'Exception stack:',
      exception instanceof Error ? exception.stack : 'No stack trace',
    );
    console.error(
      'Exception message:',
      exception instanceof Error ? exception.message : 'No message',
    );
    console.error('=======================');

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        const data = res as any;
        reason_code = data?.reason_code ?? null;
        if (reason_code && message_key[reason_code as keyof typeof message_key]) {
          message = message_key[reason_code as keyof typeof message_key];
        } else {
          message = data?.message || message;
        }
      } else if (typeof res === 'string') {
        message = res;
      }
    } else {
      console.error('Non-HttpException details:');
      console.error('Request URL:', ctx.getRequest()?.url);
      console.error('Request method:', ctx.getRequest()?.method);
      console.error('Request headers:', ctx.getRequest()?.headers);
      console.error('Request body:', ctx.getRequest()?.body);
    }

    const errorRes: StandardResponse = {
      message,
      code,
      reason_code: reason_code ?? undefined,
      success: false,
    };

    return response.status(code).json(errorRes);
  }
}
