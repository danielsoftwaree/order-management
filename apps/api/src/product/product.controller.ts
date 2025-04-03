import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async getProducts() {
        return this.productService.getProducts();
    }

    @Post()
    async createProduct(@Body() product: ProductDto) {
        return this.productService.createProduct(product);
    }
}
