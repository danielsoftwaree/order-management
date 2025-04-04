import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiError } from '../../common/errors/api-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserService', () => {
    let service: UserService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            upsert: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('user', () => {
        it('should return a user if found', async () => {
            const mockUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                balance: 1000,
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.user({ id: '1' });

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('should return null if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            const result = await service.user({ id: '999' });

            expect(result).toBeNull();
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '999' },
            });
        });
    });

    describe('findUser', () => {
        it('should return a user if found', async () => {
            const mockUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                balance: 1000,
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.findUser({ id: '1' });

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('should throw ApiError if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.findUser({ id: '999' })).rejects.toThrow(
                new ApiError(ErrorCode.USER_NOT_FOUND)
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '999' },
            });
        });
    });

    describe('decreaseUserBalance', () => {
        it('should decrease user balance if enough funds available', async () => {
            const mockUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                balance: 1000,
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            mockPrismaService.user.update.mockResolvedValue({ ...mockUser, balance: 800 });

            await service.decreaseUserBalance('1', 200);

            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { balance: { decrement: 200 } },
            });
        });

        it('should throw ApiError if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.decreaseUserBalance('999', 200)).rejects.toThrow(
                new ApiError(ErrorCode.USER_NOT_FOUND)
            );
            expect(prismaService.user.update).not.toHaveBeenCalled();
        });

        it('should throw ApiError if insufficient funds', async () => {
            const mockUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                balance: 100,
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            await expect(service.decreaseUserBalance('1', 200)).rejects.toThrow(
                new ApiError(ErrorCode.INSUFFICIENT_FUNDS)
            );
            expect(prismaService.user.update).not.toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'New User',
                email: 'new@example.com',
                password: 'password123',
            };
            const createdUser = {
                id: '2',
                ...createUserDto,
                balance: 0,
            };
            mockPrismaService.user.upsert.mockResolvedValue(createdUser);

            const result = await service.createUser(createUserDto);

            expect(result).toEqual(createdUser);
            expect(prismaService.user.upsert).toHaveBeenCalledWith({
                where: { email: createUserDto.email },
                update: {},
                create: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    password: createUserDto.password,
                },
            });
        });
    });

    describe('validateUserBalance', () => {
        it('should not throw error if user has sufficient balance', async () => {
            const mockUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                balance: 1000,
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            await expect(service.validateUserBalance('1', 500)).resolves.not.toThrow();
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });

        it('should throw ApiError if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(service.validateUserBalance('999', 500)).rejects.toThrow(
                new ApiError(ErrorCode.USER_NOT_FOUND)
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '999' },
            });
        });

        it('should throw ApiError if insufficient funds', async () => {
            const mockUser = {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                balance: 400,
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            await expect(service.validateUserBalance('1', 500)).rejects.toThrow(
                new ApiError(ErrorCode.INSUFFICIENT_FUNDS)
            );
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });
}); 