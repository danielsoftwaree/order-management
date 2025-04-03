/**
 * API error codes
 * Prefixes:
 * AUTH - Authentication/authorization errors
 * USER - User-related errors
 * PRODUCT - Product-related errors
 * ORDER - Order-related errors
 * VALIDATION - Validation errors
 * RATE_LIMIT - Rate limit errors
 * SERVER - Server errors
 */
export enum ErrorCode {
    // Base errors (400-499)
    BAD_REQUEST = 'BAD_REQUEST',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

    // Authentication errors (401-403)
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    ACCESS_DENIED = 'ACCESS_DENIED',

    // User errors
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',

    // Product errors
    PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
    PRODUCT_ALREADY_EXISTS = 'PRODUCT_ALREADY_EXISTS',
    INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',

    // Order errors
    ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
    ORDER_CREATION_FAILED = 'ORDER_CREATION_FAILED',

    // Rate limit errors
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

    // Transaction errors
    TRANSACTION_FAILED = 'TRANSACTION_FAILED',

    // Server errors (500+)
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    DATABASE_ERROR = 'DATABASE_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}
