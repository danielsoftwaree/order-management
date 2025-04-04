import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../services/order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductService } from '../../product/services/product.service';
import { UserService } from '../../user/services/user.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { User } from '@prisma/client';
import { ApiError } from '../../common/errors/api-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { OrderDto } from '../dto/order.dto';

describe('OrderService', () => {
    let service: OrderService;
    let prismaService: PrismaService;
    let productService: ProductService;
    let userService: UserService;

    const mockPrismaService = {
        order: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };

    const mockProductService = {
        getProductById: jest.fn(),
        decreaseProductStock: jest.fn(),
    };

    const mockUserService = {
        decreaseUserBalance: jest.fn(),
    };

    const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        balance: 1000,
    };

    const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 100,
        stock: 10,
    };

    const mockOrder = {
        id: '1',
        userId: '1',
        productId: '1',
        quantity: 2,
        totalPrice: 200,
        createdAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: ProductService,
                    useValue: mockProductService,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        service = module.get<OrderService>(OrderService);
        prismaService = module.get<PrismaService>(PrismaService);
        productService = module.get<ProductService>(ProductService);
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createOrder', () => {
        it('should create an order successfully', async () => {
            const dto: CreateOrderDto = {
                productId: '1',
                quantity: 2,
            };

            mockProductService.getProductById.mockResolvedValue(mockProduct);
            mockPrismaService.order.create.mockResolvedValue(mockOrder);

            const result = await service.createOrder(mockUser, dto);

            expect(result).toEqual(mockOrder);
            expect(productService.getProductById).toHaveBeenCalledWith(dto.productId);
            expect(prismaService.order.create).toHaveBeenCalledWith({
                data: {
                    productId: dto.productId,
                    userId: mockUser.id,
                    quantity: dto.quantity,
                    totalPrice: mockProduct.price * dto.quantity,
                },
            });
            expect(userService.decreaseUserBalance).toHaveBeenCalledWith(
                mockUser.id,
                mockProduct.price * dto.quantity
            );
            expect(productService.decreaseProductStock).toHaveBeenCalledWith(
                dto.productId,
                dto.quantity
            );
        });

        it('should throw an error if product not found', async () => {
            const dto: CreateOrderDto = {
                productId: '999',
                quantity: 2,
            };

            mockProductService.getProductById.mockResolvedValue(null);

            await expect(service.createOrder(mockUser, dto)).rejects.toThrow(
                new ApiError(ErrorCode.PRODUCT_NOT_FOUND)
            );
            expect(productService.getProductById).toHaveBeenCalledWith(dto.productId);
            expect(prismaService.order.create).not.toHaveBeenCalled();
        });

        it('should throw an error if product out of stock', async () => {
            const dto: CreateOrderDto = {
                productId: '1',
                quantity: 20, // больше чем stock (10)
            };

            mockProductService.getProductById.mockResolvedValue(mockProduct);

            await expect(service.createOrder(mockUser, dto)).rejects.toThrow(
                new ApiError(ErrorCode.PRODUCT_OUT_OF_STOCK)
            );
            expect(productService.getProductById).toHaveBeenCalledWith(dto.productId);
            expect(prismaService.order.create).not.toHaveBeenCalled();
        });

        it('should throw an error if insufficient funds', async () => {
            const dto: CreateOrderDto = {
                productId: '1',
                quantity: 15, // 15 * 100 = 1500 > 1000 (баланс)
            };

            mockProductService.getProductById.mockResolvedValue({
                ...mockProduct,
                stock: 20, // увеличиваем сток чтобы пройти проверку на PRODUCT_OUT_OF_STOCK
            });

            await expect(service.createOrder(mockUser, dto)).rejects.toThrow(
                new ApiError(ErrorCode.INSUFFICIENT_FUNDS)
            );
            expect(productService.getProductById).toHaveBeenCalledWith(dto.productId);
            expect(prismaService.order.create).not.toHaveBeenCalled();
        });
    });

    describe('getOrderByUserId', () => {
        it('should return orders for a user', async () => {
            const orders = [mockOrder];
            mockPrismaService.order.findMany.mockResolvedValue(orders);

            const result = await service.getOrderByUserId('1');

            expect(result).toBe(orders);
            expect(prismaService.order.findMany).toHaveBeenCalledWith({
                where: {
                    userId: '1',
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });

        it('should throw an error if orders not found', async () => {
            mockPrismaService.order.findMany.mockResolvedValue(null);

            await expect(service.getOrderByUserId('999')).rejects.toThrow(
                new ApiError(ErrorCode.ORDER_NOT_FOUND)
            );
            expect(prismaService.order.findMany).toHaveBeenCalledWith({
                where: {
                    userId: '999',
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });
    });
}); 