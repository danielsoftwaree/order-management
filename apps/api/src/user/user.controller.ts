import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserResponseDto } from './dto/response/user.response.dto';

@Controller('user')
export class UserController {
    @Get()
    async getUser(@CurrentUser() user: User): Promise<UserResponseDto> {
        return {
            name: user.name,
            email: user.email,
            balance: user.balance,
        };
    }
}
