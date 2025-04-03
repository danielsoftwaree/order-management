import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MockPrismaService, mockPrismaClient } from '../../prisma/__mocks__/prisma.service';
import { ApiError } from '../../common/errors/api-error';

describe('ProductService', () => {
    let service: ProductService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        MockPrismaService.resetMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: PrismaService,
                    useClass: MockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProducts', () => {
        it('should return an array of products', async () => {
            const mockProducts = [
                { id: '1', name: 'Product 1', price: 10, stock: 10 },
                { id: '2', name: 'Product 2', price: 20, stock: 20 },
            ];

            mockPrismaClient.product.findMany.mockResolvedValueOnce(mockProducts);

            const products = await service.getProducts();

            expect(mockPrismaClient.product.findMany).toHaveBeenCalledTimes(1);
            expect(products).toHaveLength(2);
            expect(products[0].name).toBe('Product 1');
            expect(products[1].name).toBe('Product 2');
        });

        it('should throw an error if products are not found', async () => {
            mockPrismaClient.product.findMany.mockResolvedValueOnce(null);

            await expect(service.getProducts()).rejects.toThrow(ApiError);
            expect(mockPrismaClient.product.findMany).toHaveBeenCalledTimes(1);
        });

        it('should throw an internal error if database query fails', async () => {
            const databaseError = new Error('Database connection error');
            mockPrismaClient.product.findMany.mockRejectedValueOnce(databaseError);

            await expect(service.getProducts()).rejects.toThrow(ApiError);
            expect(mockPrismaClient.product.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const productDto = { name: 'New Product', price: 150, stock: 5 };

            mockPrismaClient.product.findUnique.mockResolvedValueOnce(null);

            mockPrismaClient.product.create.mockResolvedValueOnce({
                id: '3',
                ...productDto,
            });

            await service.createProduct(productDto);

            expect(mockPrismaClient.product.findUnique).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.product.findUnique).toHaveBeenCalledWith({
                where: { name: productDto.name },
            });
            expect(mockPrismaClient.product.create).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.product.create).toHaveBeenCalledWith({
                data: productDto,
            });
        });

        it('should throw an error if product already exists', async () => {
            const productDto = { name: 'Existing Product', price: 150, stock: 5 };
            const existingProduct = { id: '3', ...productDto };

            mockPrismaClient.product.findUnique.mockResolvedValueOnce(existingProduct);

            await expect(service.createProduct(productDto)).rejects.toThrow(ApiError);
            expect(mockPrismaClient.product.findUnique).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.product.create).not.toHaveBeenCalled();
        });
    });
}); 