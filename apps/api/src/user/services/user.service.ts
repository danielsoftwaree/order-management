import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiError } from 'src/common/errors/api-error';
import { ErrorCode } from 'src/common/errors/error-codes';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    return user;
  }

  async findUser(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (!user) {
      throw new ApiError(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  }

  async decreaseUserBalance(userId: string, amount: number) {
    await this.validateUserBalance(userId, amount);

    await this.prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } },
    });
  }

  async createUser(data: CreateUserDto) {
    const user = await this.prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return user;
  }

  async validateUserBalance(userId: string, amount: number) {
    const user = await this.user({ id: userId });

    if (!user) {
      throw new ApiError(ErrorCode.USER_NOT_FOUND);
    }

    if (user.balance < amount) {
      throw new ApiError(ErrorCode.INSUFFICIENT_FUNDS);
    }
  }
}
