import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { z } from 'zod';

export const ApiErrorDataSchema = z.array(z.string());

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
        },
    },
});

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: AxiosError<z.infer<typeof ApiErrorDataSchema>>;
    }
}