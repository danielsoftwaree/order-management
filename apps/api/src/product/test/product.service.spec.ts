import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../services/product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiError } from '../../common/errors/api-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { ProductDto } from '../dto/product.dto';

describe('ProductService', () => {
    let service: ProductService;
    let prismaService: PrismaService;

    // Создаем мок для призмы
    const mockPrismaService = {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProducts', () => {
        it('should return an array of products', async () => {
            const mockProducts = [
                { id: '1', name: 'Product 1', price: 100, stock: 10 },
                { id: '2', name: 'Product 2', price: 200, stock: 20 },
            ];
            mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

            const result = await service.getProducts();

            expect(result).toEqual(mockProducts);
            expect(prismaService.product.findMany).toHaveBeenCalled();
        });

        it('should throw ApiError if no products found', async () => {
            mockPrismaService.product.findMany.mockResolvedValue(null);

            await expect(service.getProducts()).rejects.toThrow(ApiError);
            expect(prismaService.product.findMany).toHaveBeenCalled();
        });

        it('should throw an internal error if database query fails', async () => {
            mockPrismaService.product.findMany.mockRejectedValue(new Error('Database error'));

            await expect(service.getProducts()).rejects.toThrow(ApiError);
            expect(prismaService.product.findMany).toHaveBeenCalled();
        });
    });

    describe('getProductById', () => {
        it('should return a product if found', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 100, stock: 10 };
            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

            const result = await service.getProductById('1');

            expect(result).toEqual(mockProduct);
            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('should throw ApiError if product not found', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(null);

            await expect(service.getProductById('999')).rejects.toThrow(
                new ApiError(ErrorCode.PRODUCT_NOT_FOUND)
            );
            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { id: '999' },
            });
        });
    });

    describe('decreaseProductStock', () => {
        it('should decrease product stock if enough stock available', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 100, stock: 10 };
            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
            mockPrismaService.product.update.mockResolvedValue({ ...mockProduct, stock: 8 });

            await service.decreaseProductStock('1', 2);

            expect(prismaService.product.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { stock: { decrement: 2 } },
            });
        });

        it('should throw ApiError if not enough stock', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 100, stock: 1 };
            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

            await expect(service.decreaseProductStock('1', 2)).rejects.toThrow(
                new ApiError(ErrorCode.PRODUCT_OUT_OF_STOCK)
            );
            expect(prismaService.product.update).not.toHaveBeenCalled();
        });

        it('should throw ApiError if stock is 0', async () => {
            const mockProduct = { id: '1', name: 'Product 1', price: 100, stock: 0 };
            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

            await expect(service.decreaseProductStock('1', 1)).rejects.toThrow(
                new ApiError(ErrorCode.PRODUCT_OUT_OF_STOCK)
            );
            expect(prismaService.product.update).not.toHaveBeenCalled();
        });
    });

    describe('createProduct', () => {
        it('should create a product if name does not exist', async () => {
            const productDto: ProductDto = { name: 'New Product', price: 150, stock: 15 };
            mockPrismaService.product.findUnique.mockResolvedValue(null);

            await service.createProduct(productDto);

            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { name: 'New Product' },
            });
            expect(prismaService.product.create).toHaveBeenCalledWith({
                data: productDto,
            });
        });

        it('should throw ApiError if product with name already exists', async () => {
            const productDto: ProductDto = { name: 'Existing Product', price: 150, stock: 15 };
            mockPrismaService.product.findUnique.mockResolvedValue({ id: '1', ...productDto });

            await expect(service.createProduct(productDto)).rejects.toThrow(ApiError);
            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { name: 'Existing Product' },
            });
            expect(prismaService.product.create).not.toHaveBeenCalled();
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const productDto: ProductDto = { name: 'Updated Product', price: 150, stock: 15 };
            mockPrismaService.product.update.mockResolvedValue({ id: '1', ...productDto });

            await service.updateProduct('1', productDto);

            expect(prismaService.product.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: productDto,
            });
        });
    });

    describe('findProductByNameAndThrow', () => {
        it('should not throw if product with name does not exist', async () => {
            mockPrismaService.product.findUnique.mockResolvedValue(null);

            await expect(service.findProductByNameAndThrow('New Product')).resolves.not.toThrow();
            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { name: 'New Product' },
            });
        });

        it('should throw ApiError if product with name already exists', async () => {
            const mockProduct = { id: '1', name: 'Existing Product', price: 150, stock: 15 };
            mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

            await expect(service.findProductByNameAndThrow('Existing Product')).rejects.toThrow(
                new ApiError(ErrorCode.PRODUCT_ALREADY_EXISTS)
            );
            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { name: 'Existing Product' },
            });
        });
    });
}); 