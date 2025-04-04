import { Test } from '@nestjs/testing';
import { ProductModule } from '../product.module';
import { ProductService } from '../services/product.service';
import { ProductController } from '../product.controller';
import { PrismaModule } from '../../prisma/prisma.module';

describe('ProductModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [ProductModule],
        }).compile();

        expect(module).toBeDefined();
    });

    it('should provide ProductService', async () => {
        const module = await Test.createTestingModule({
            imports: [ProductModule],
        }).compile();

        const service = module.get<ProductService>(ProductService);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(ProductService);
    });

    it('should register ProductController', async () => {
        const module = await Test.createTestingModule({
            imports: [ProductModule],
        }).compile();

        const controller = module.get<ProductController>(ProductController);
        expect(controller).toBeDefined();
        expect(controller).toBeInstanceOf(ProductController);
    });

    it('should import PrismaModule', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ProductModule],
        }).compile();

        const imports = Reflect.getMetadata('imports', ProductModule);
        expect(imports).toContain(PrismaModule);
    });
}); 