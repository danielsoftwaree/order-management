import { Test } from '@nestjs/testing';
import { UserModule } from '../user.module';
import { UserService } from '../services/user.service';
import { UserController } from '../user.controller';
import { PrismaModule } from '../../prisma/prisma.module';

describe('UserModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        expect(module).toBeDefined();
    });

    it('should provide UserService', async () => {
        const module = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        const service = module.get<UserService>(UserService);
        expect(service).toBeDefined();
        expect(service).toBeInstanceOf(UserService);
    });

    it('should register UserController', async () => {
        const module = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        const controller = module.get<UserController>(UserController);
        expect(controller).toBeDefined();
        expect(controller).toBeInstanceOf(UserController);
    });

    it('should import PrismaModule', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        const imports = Reflect.getMetadata('imports', UserModule);
        expect(imports).toContain(PrismaModule);
    });
}); 