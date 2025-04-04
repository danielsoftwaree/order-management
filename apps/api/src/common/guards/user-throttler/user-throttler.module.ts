import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserThrottlerGuard } from './user-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ThrottlerModule.forRoot([{
            name: 'user-limit',
            ttl: 60000,
            limit: 10,
        }]),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: UserThrottlerGuard,
        },
    ],
    exports: [ThrottlerModule],
})
export class UserThrottlerModule { } 