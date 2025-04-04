import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { User } from '@prisma/client';
import { ApiError } from '../../common/errors/api-error';
import { ErrorCode } from '../../common/errors/error-codes';

describe('OrderController', () => {
    let controller: OrderController;
    let orderService: OrderService;

    const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        balance: 1000,
    };

    const mockOrder = {
        id: '1',
        userId: '1',
        productId: '1',
        quantity: 2,
        totalPrice: 200,
        createdAt: new Date(),
    };

    const mockOrderService = {
        createOrder: jest.fn(),
        getOrderByUserId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [
                {
                    provide: OrderService,
                    useValue: mockOrderService,
                },
            ],
        }).compile();

        controller = module.get<OrderController>(OrderController);
        orderService = module.get<OrderService>(OrderService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('createOrder', () => {
        it('should create an order successfully', async () => {
            const dto: CreateOrderDto = {
                productId: '1',
                quantity: 2,
            };
            mockOrderService.createOrder.mockResolvedValue(mockOrder);

            const result = await controller.createOrder(dto, mockUser);

            expect(result).toBe(mockOrder);
            expect(orderService.createOrder).toHaveBeenCalledWith(mockUser, dto);
        });

        it('should throw an error if product not found', async () => {
            const dto: CreateOrderDto = {
                productId: '999',
                quantity: 2,
            };
            const error = new ApiError(ErrorCode.PRODUCT_NOT_FOUND);
            mockOrderService.createOrder.mockRejectedValue(error);

            await expect(controller.createOrder(dto, mockUser)).rejects.toThrow(error);
            expect(orderService.createOrder).toHaveBeenCalledWith(mockUser, dto);
        });

        it('should throw an error if product out of stock', async () => {
            const dto: CreateOrderDto = {
                productId: '1',
                quantity: 100,
            };
            const error = new ApiError(ErrorCode.PRODUCT_OUT_OF_STOCK);
            mockOrderService.createOrder.mockRejectedValue(error);

            await expect(controller.createOrder(dto, mockUser)).rejects.toThrow(error);
            expect(orderService.createOrder).toHaveBeenCalledWith(mockUser, dto);
        });

        it('should throw an error if insufficient funds', async () => {
            const dto: CreateOrderDto = {
                productId: '1',
                quantity: 10,
            };
            const error = new ApiError(ErrorCode.INSUFFICIENT_FUNDS);
            mockOrderService.createOrder.mockRejectedValue(error);

            await expect(controller.createOrder(dto, mockUser)).rejects.toThrow(error);
            expect(orderService.createOrder).toHaveBeenCalledWith(mockUser, dto);
        });
    });

    describe('getOrderById', () => {
        it('should return orders for a user', async () => {
            const orders = [mockOrder];
            mockOrderService.getOrderByUserId.mockResolvedValue(orders);

            const result = await controller.getOrderById('1');

            expect(result).toBe(orders);
            expect(orderService.getOrderByUserId).toHaveBeenCalledWith('1');
        });

        it('should throw an error if orders not found', async () => {
            const error = new ApiError(ErrorCode.ORDER_NOT_FOUND);
            mockOrderService.getOrderByUserId.mockRejectedValue(error);

            await expect(controller.getOrderById('999')).rejects.toThrow(error);
            expect(orderService.getOrderByUserId).toHaveBeenCalledWith('999');
        });
    });
}); 