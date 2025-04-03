import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { OrderDto } from './dto/order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post()
    async createOrder(
        @Body() order: CreateOrderDto,
        @CurrentUser() user: User
    ): Promise<OrderDto> {
        return this.orderService.createOrder(user, order);
    }

    @Get("/:id")
    async getOrderById(@Param("id") userId: string): Promise<OrderDto[]> {
        return this.orderService.getOrderById(userId);
    }
}
