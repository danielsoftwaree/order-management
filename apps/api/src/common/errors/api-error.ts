import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes';
import { ErrorMessages } from './error-messages';

const HTTP_STATUS_MAP: Record<ErrorCode, HttpStatus> = {
    // Common errors
    [ErrorCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
    [ErrorCode.VALIDATION_ERROR]: HttpStatus.UNPROCESSABLE_ENTITY,
    [ErrorCode.RESOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,

    // Authentication errors
    [ErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
    [ErrorCode.FORBIDDEN]: HttpStatus.FORBIDDEN,
    [ErrorCode.ACCESS_DENIED]: HttpStatus.FORBIDDEN,

    // User errors
    [ErrorCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ErrorCode.USER_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [ErrorCode.INSUFFICIENT_FUNDS]: HttpStatus.FORBIDDEN,

    // Product errors
    [ErrorCode.PRODUCT_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ErrorCode.PRODUCT_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [ErrorCode.INSUFFICIENT_STOCK]: HttpStatus.CONFLICT,
    [ErrorCode.PRODUCT_OUT_OF_STOCK]: HttpStatus.CONFLICT,

    // Order errors
    [ErrorCode.ORDER_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [ErrorCode.ORDER_CREATION_FAILED]: HttpStatus.BAD_REQUEST,

    // Rate limit errors
    [ErrorCode.RATE_LIMIT_EXCEEDED]: HttpStatus.TOO_MANY_REQUESTS,

    // Transaction errors
    [ErrorCode.TRANSACTION_FAILED]: HttpStatus.INTERNAL_SERVER_ERROR,

    // Server errors
    [ErrorCode.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCode.DATABASE_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
    [ErrorCode.SERVICE_UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE
};

/**
 * Interface for representing an error
 */
export interface ErrorResponse {
    success: false;
    error: {
        code: ErrorCode;
        message: string;
    };
    details?: any;
}

/**
 * API error class
 */
export class ApiError extends Error {
    readonly code: ErrorCode;
    readonly httpStatus: HttpStatus;
    readonly details?: any;

    constructor(code: ErrorCode, details?: any, message?: string) {
        super(message || ErrorMessages[code]);
        this.code = code;
        this.httpStatus = HTTP_STATUS_MAP[code];
        this.details = details;
    }

    /**
     * Converts the error to an API response format
     */
    toResponse(): ErrorResponse {
        return {
            success: false,
            error: {
                code: this.code,
                message: this.message,
            },
            ...(this.details && { details: this.details }),
        };
    }

    /**
     * Factory methods for creating typical errors
     */
    static badRequest(details?: any): ApiError {
        return new ApiError(ErrorCode.BAD_REQUEST, details);
    }

    static notFound(code: ErrorCode = ErrorCode.RESOURCE_NOT_FOUND, details?: any): ApiError {
        return new ApiError(code, details);
    }

    static validation(details?: any): ApiError {
        return new ApiError(ErrorCode.VALIDATION_ERROR, details);
    }

    static insufficientFunds(available: number, required: number): ApiError {
        return new ApiError(ErrorCode.INSUFFICIENT_FUNDS, { available, required });
    }

    static insufficientStock(available: number, requested: number): ApiError {
        return new ApiError(ErrorCode.INSUFFICIENT_STOCK, { available, requested });
    }

    static rateLimitExceeded(retryAfter: number): ApiError {
        return new ApiError(ErrorCode.RATE_LIMIT_EXCEEDED, { retryAfter });
    }

    static internal(details?: any): ApiError {
        return new ApiError(ErrorCode.INTERNAL_SERVER_ERROR, details);
    }
}
