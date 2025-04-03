import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { SuccessResponse } from '../responses/api-response';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
    private readonly logger = new Logger('ApiResponse');

    intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const { method, url, ip, body, params, query } = request;
        const startTime = Date.now();

        this.logger.log(`[REQUEST] ${method} ${url} - IP: ${ip}`);

        if (process.env.NODE_ENV === 'development') {
            if (Object.keys(body).length > 0) this.logger.debug(`[REQUEST BODY] ${JSON.stringify(body)}`);
            if (Object.keys(params).length > 0) this.logger.debug(`[REQUEST PARAMS] ${JSON.stringify(params)}`);
            if (Object.keys(query).length > 0) this.logger.debug(`[REQUEST QUERY] ${JSON.stringify(query)}`);
        }

        return next.handle().pipe(
            map((data) => {
                if (data && typeof data === 'object' && 'success' in data && data.success === true) {
                    return data;
                }
                if (response.statusCode === HttpStatus.CREATED) {
                    return { success: true, data };
                }
                if (!data && response.statusCode === HttpStatus.NO_CONTENT) {
                    return { success: true, data: null };
                }
                return { success: true, data };
            }),
            tap((responseData) => {
                const duration = Date.now() - startTime;
                const statusCode = response.statusCode;
                this.logger.log(`[RESPONSE] ${method} ${url} - ${statusCode} - ${duration}ms`);

                if (process.env.NODE_ENV === 'development') {
                    const logData = this.truncateLogData(responseData);
                    this.logger.debug(`[RESPONSE DATA] ${JSON.stringify(logData)}`);
                }
            }),
        );
    }

    private truncateLogData(data: any): any {
        const MAX_LOG_SIZE = 1000;

        if (!data) return data;

        const stringifiedData = JSON.stringify(data);

        if (stringifiedData.length <= MAX_LOG_SIZE) {
            return data;
        }

        if (data.data && Array.isArray(data.data)) {
            const truncatedData = { ...data };
            const itemCount = data.data.length;

            if (itemCount > 0) {
                truncatedData.data = [data.data[0]];
                truncatedData._truncated = `Showing 1 of ${itemCount} items`;
            }

            return truncatedData;
        }

        return {
            _truncated: `Response data truncated (${stringifiedData.length} chars)`,
            preview: stringifiedData.substring(0, MAX_LOG_SIZE) + '...',
        };
    }
}
