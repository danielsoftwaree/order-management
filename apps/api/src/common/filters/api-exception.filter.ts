import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiError, ErrorResponse } from '../errors/api-error';
import { ErrorCode } from '../errors/error-codes';
import { ErrorMessages } from '../errors/error-messages';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ApiExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let errorResponse: ErrorResponse;
        let httpStatus: HttpStatus;

        if (exception instanceof ApiError) {
            httpStatus = exception.httpStatus;
            errorResponse = exception.toResponse();
        } else if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const hasMessage = 'message' in exceptionResponse;
                errorResponse = {
                    success: false,
                    error: {
                        code: ErrorCode.VALIDATION_ERROR,
                        message: hasMessage
                            ? Array.isArray(exceptionResponse['message'])
                                ? 'Validation error'
                                : String(exceptionResponse['message'])
                            : ErrorMessages[ErrorCode.VALIDATION_ERROR],
                    },
                    details: hasMessage && Array.isArray(exceptionResponse['message'])
                        ? { fields: exceptionResponse['message'] }
                        : undefined,
                };
            } else {
                errorResponse = {
                    success: false,
                    error: {
                        code: ErrorCode.BAD_REQUEST,
                        message: exceptionResponse as string,
                    },
                };
            }
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse = {
                success: false,
                error: {
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    message: ErrorMessages[ErrorCode.INTERNAL_SERVER_ERROR],
                },
            };

            this.logger.error(
                `Unexpected error: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        }

        this.logger.debug(
            `[${request.method}] ${request.url}: [${httpStatus}] ${errorResponse.error.code} - ${errorResponse.error.message}`,
        );

        response.status(httpStatus).json(errorResponse);
    }
}