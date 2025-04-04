import { Test } from '@nestjs/testing';
import { OrderModule } from '../order.module';
import { OrderService } from '../services/order.service';
import { OrderController } from '../order.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProductModule } from '../../product/product.module';
import { UserModule } from '../../user/user.module';

describe('OrderModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [OrderModule],
        }).compile();

        expect(module).toBeDefined();
    });

    it('should provide OrderService', async () => {
        const module = await Test.createTestingModule({
            imports: [OrderModule],
        }).compile();

        const service = module.get<OrderService>(OrderService);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(OrderService);
    });

    it('should register OrderController', async () => {
        const module = await Test.createTestingModule({
            imports: [OrderModule],
        }).compile();

        const controller = module.get<OrderController>(OrderController);
        expect(controller).toBeDefined();
        expect(controller).toBeInstanceOf(OrderController);
    });

    it('should import required modules', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [OrderModule],
        }).compile();

        const imports = Reflect.getMetadata('imports', OrderModule);
        expect(imports).toContain(PrismaModule);
        expect(imports).toContain(ProductModule);
        expect(imports).toContain(UserModule);
    });
}); 