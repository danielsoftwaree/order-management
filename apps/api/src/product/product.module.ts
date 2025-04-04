import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './services/product.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserThrottlerModule } from '../common/guards/user-throttler/user-throttler.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})

export class ProductModule { }
