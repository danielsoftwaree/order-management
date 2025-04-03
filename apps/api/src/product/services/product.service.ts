import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from '../dto/product.dto';
import { ApiError } from 'src/common/errors/api-error';
import { ErrorCode } from 'src/common/errors/error-codes';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async getProducts(): Promise<ProductDto[]> {
        try {
            const products = await this.prisma.product.findMany();

            if (!products) {
                throw new ApiError(ErrorCode.PRODUCT_NOT_FOUND);
            }

            return products.map((product) => ({
                name: product.name,
                price: product.price,
                stock: product.stock,
            }));
        } catch (error) {
            throw ApiError.internal({
                operation: 'getProducts',
                message: error.message
            });
        }
    }

    async createProduct(product: ProductDto) {
        try {
            await this.findProductByNameAndThrow(product.name);

            await this.prisma.product.create({
                data: product,
            });
        } catch (error) {
            throw ApiError.internal({
                operation: 'createProduct',
                message: error.message
            });
        }
    }

    async findProductByNameAndThrow(name: string) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { name },
        });

        if (existingProduct) {
            throw new ApiError(ErrorCode.PRODUCT_ALREADY_EXISTS);
        }
    }
}
