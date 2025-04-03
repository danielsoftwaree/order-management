import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';

@Module({
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
    imports: [PrismaModule, ProductModule, UserModule],
})
export class OrderModule { }
