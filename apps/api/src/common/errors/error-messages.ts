import { ErrorCode } from './error-codes';

export const ErrorMessages: Record<ErrorCode, string> = {
    // Base errors
    [ErrorCode.BAD_REQUEST]: 'Invalid request',
    [ErrorCode.VALIDATION_ERROR]: 'Validation error',
    [ErrorCode.RESOURCE_NOT_FOUND]: 'Resource not found',
    [ErrorCode.TOO_MANY_REQUESTS]: 'Too many requests. Please wait a moment.',

    // Authentication errors
    [ErrorCode.UNAUTHORIZED]: 'Authentication required',
    [ErrorCode.FORBIDDEN]: 'Access denied',
    [ErrorCode.ACCESS_DENIED]: 'Insufficient permissions to perform the operation',

    // User errors
    [ErrorCode.USER_NOT_FOUND]: 'User not found',
    [ErrorCode.USER_ALREADY_EXISTS]: 'User with this email already exists',
    [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds on the user\'s balance',

    // Product errors
    [ErrorCode.PRODUCT_NOT_FOUND]: 'Product not found',
    [ErrorCode.PRODUCT_ALREADY_EXISTS]: 'Product with this name already exists',
    [ErrorCode.INSUFFICIENT_STOCK]: 'Insufficient stock',
    [ErrorCode.PRODUCT_OUT_OF_STOCK]: 'Product out of stock',

    // Order errors
    [ErrorCode.ORDER_NOT_FOUND]: 'Order not found',
    [ErrorCode.ORDER_CREATION_FAILED]: 'Failed to create order',

    // Rate limit errors
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded (10 requests per minute)',

    // Transaction errors
    [ErrorCode.TRANSACTION_FAILED]: 'Transaction failed',

    // Server errors
    [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
    [ErrorCode.DATABASE_ERROR]: 'Database error',
    [ErrorCode.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable'
};
