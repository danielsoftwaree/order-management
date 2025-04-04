import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { UserThrottlerModule } from '../common/guards/user-throttler/user-throttler.module';
@Module({
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
    imports: [PrismaModule, ProductModule, UserModule, UserThrottlerModule],
})
export class OrderModule { }
