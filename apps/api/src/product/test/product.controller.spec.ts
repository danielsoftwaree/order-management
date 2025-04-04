import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../services/product.service';
import { ProductDto } from '../dto/product.dto';
import { ApiError } from '../../common/errors/api-error';
import { ErrorCode } from '../../common/errors/error-codes';

describe('ProductController', () => {
    let controller: ProductController;
    let productService: ProductService;

    const mockProductService = {
        getProducts: jest.fn(),
        createProduct: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: mockProductService,
                },
            ],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        productService = module.get<ProductService>(ProductService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getProducts', () => {
        it('should return an array of products', async () => {
            const products = [
                { id: '1', name: 'Product 1', price: 100, stock: 10 },
                { id: '2', name: 'Product 2', price: 200, stock: 20 },
            ];
            mockProductService.getProducts.mockResolvedValue(products);

            const result = await controller.getProducts();

            expect(result).toBe(products);
            expect(productService.getProducts).toHaveBeenCalled();
        });

        it('should throw an error if service throws', async () => {
            const error = new ApiError(ErrorCode.PRODUCT_NOT_FOUND);
            mockProductService.getProducts.mockRejectedValue(error);

            await expect(controller.getProducts()).rejects.toThrow(error);
            expect(productService.getProducts).toHaveBeenCalled();
        });
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const dto: ProductDto = { name: 'New Product', price: 150, stock: 15 };
            mockProductService.createProduct.mockResolvedValue(undefined);

            await controller.createProduct(dto);

            expect(productService.createProduct).toHaveBeenCalledWith(dto);
        });

        it('should throw an error if product already exists', async () => {
            const dto: ProductDto = { name: 'Existing Product', price: 150, stock: 15 };
            const error = new ApiError(ErrorCode.PRODUCT_ALREADY_EXISTS);
            mockProductService.createProduct.mockRejectedValue(error);

            await expect(controller.createProduct(dto)).rejects.toThrow(error);
            expect(productService.createProduct).toHaveBeenCalledWith(dto);
        });
    });
}); 