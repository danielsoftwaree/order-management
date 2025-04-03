export interface SuccessResponse<T> {
    success: true;
    data: T;
    meta?: Record<string, any>;
}

export class ApiResponse {

    static success<T>(data: T, meta?: Record<string, any>): SuccessResponse<T> {
        return {
            success: true,
            data,
            ...(meta && { meta }),
        };
    }

    static noContent(): SuccessResponse<null> {
        return {
            success: true,
            data: null,
        };
    }

    static message(message: string): SuccessResponse<{ message: string }> {
        return {
            success: true,
            data: { message },
        };
    }


    static created<T>(data: T): SuccessResponse<T> {
        return {
            success: true,
            data,
        };
    }
}