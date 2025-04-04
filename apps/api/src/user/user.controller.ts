import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserResponseDto } from './dto/response/user.response.dto';
import { UserService } from './services/user.service';
import { ErrorCode } from 'src/common/errors/error-codes';
import { ApiError } from 'src/common/errors/api-error';
import { UserThrottlerGuard } from 'src/common/guards/user-throttler/user-throttler.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getUser(@CurrentUser() user: User): Promise<UserResponseDto> {
        const existingUser = await this.userService.findUser({ id: user.id });

        return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            balance: existingUser.balance,
        };
    }
}
