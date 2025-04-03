import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
export const CurrentUser = createParamDecorator(
    (data: never, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
); 