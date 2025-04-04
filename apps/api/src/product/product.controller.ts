import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserThrottlerGuard } from '../common/guards/user-throttler/user-throttler.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getProducts() {
        return this.productService.getProducts();
    }

    @Post('/create')
    async createProduct(@Body() product: ProductDto) {
        return this.productService.createProduct(product);
    }
}
