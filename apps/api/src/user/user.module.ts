import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserThrottlerModule } from '@/common/guards/user-throttler/user-throttler.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})

export class UserModule { }
