import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Prisma, User } from '@prisma/client';
import { ErrorCode } from 'src/common/errors/error-codes';
import { ApiError } from 'src/common/errors/api-error';
import { ProductService } from 'src/product/services/product.service';
import { UserService } from 'src/user/services/user.service';
import { OrderDto } from '../dto/order.dto';

@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly productService: ProductService,
        private readonly userService: UserService
    ) { }

    async createOrder(user: User, order: CreateOrderDto): Promise<OrderDto> {
        const { productId, quantity } = order;

        const createdOrder = await this.prisma.$transaction(async (prisma) => {
            const existingProduct = await this.productService.getProductById(productId);

            if (!existingProduct) {
                throw new ApiError(ErrorCode.PRODUCT_NOT_FOUND);
            }

            if (existingProduct.stock < quantity) {
                throw new ApiError(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            const totalPrice = existingProduct.price * quantity;

            if (user.balance < totalPrice) {
                throw new ApiError(ErrorCode.INSUFFICIENT_FUNDS);
            }

            //TODO: create service method for creating order
            const order = await prisma.order.create({
                data: {
                    productId,
                    userId: user.id,
                    quantity,
                    totalPrice,
                },
            });

            await this.userService.decreaseUserBalance(user.id, totalPrice);
            await this.productService.decreaseProductStock(productId, quantity);

            return {
                id: order.id,
                userId: order.userId,
                productId: order.productId,
                quantity: order.quantity,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt,
            };
        }, {
            maxWait: 5000,
            timeout: 10000,
            isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        });

        return createdOrder;
    }
}
