import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiError } from '../../common/errors/api-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { ProductDto } from '../dto/product.dto';

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
                id: product.id,
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

    async getProductById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new ApiError(ErrorCode.PRODUCT_NOT_FOUND);
        }

        return product;
    }

    async decreaseProductStock(id: string, quantity: number) {
        const product = await this.getProductById(id);

        if (product.stock === 0 || product.stock < quantity) {
            throw new ApiError(ErrorCode.PRODUCT_OUT_OF_STOCK);
        }

        await this.prisma.product.update({
            where: { id },
            data: { stock: { decrement: quantity } },
        });
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

    async updateProduct(id: string, product: ProductDto) {
        await this.prisma.product.update({
            where: { id },
            data: product,
        });
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
