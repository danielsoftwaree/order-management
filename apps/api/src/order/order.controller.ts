import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    async createOrder(
        @Body() order: CreateOrderDto,
        @CurrentUser() user: User
    ): Promise<OrderDto> {
        return this.orderService.createOrder(user, order);
    }
}
