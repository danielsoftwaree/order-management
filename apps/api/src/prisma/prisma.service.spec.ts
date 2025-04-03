import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
    let service: PrismaService;

    let mockConnect: jest.Mock;

    beforeEach(async () => {
        mockConnect = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService],
        })
            .overrideProvider(PrismaService)
            .useValue({
                $connect: mockConnect,
                onModuleInit: PrismaService.prototype.onModuleInit,
            })
            .compile();

        service = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should call $connect when onModuleInit is called', async () => {
            await service.onModuleInit();

            expect(mockConnect).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if $connect fails', async () => {
            const connectionError = new Error('Failed to connect to database');
            mockConnect.mockRejectedValueOnce(connectionError);

            await expect(service.onModuleInit()).rejects.toThrow(connectionError);
            expect(mockConnect).toHaveBeenCalledTimes(1);
        });
    });
}); 