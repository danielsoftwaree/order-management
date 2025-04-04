import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../services/user.service';
import { User } from '@prisma/client';
import { ApiError } from '../../common/errors/api-error';
import { ErrorCode } from '../../common/errors/error-codes';

describe('UserController', () => {
    let controller: UserController;
    let userService: UserService;

    const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        balance: 1000,
    };

    const mockUserService = {
        findUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getUser', () => {
        it('should return user data without password', async () => {
            mockUserService.findUser.mockResolvedValue(mockUser);

            const result = await controller.getUser(mockUser);

            expect(result).toEqual({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                balance: mockUser.balance,
            });
            expect(userService.findUser).toHaveBeenCalledWith({ id: mockUser.id });
        });

        it('should throw an error if user not found', async () => {
            const error = new ApiError(ErrorCode.USER_NOT_FOUND);
            mockUserService.findUser.mockRejectedValue(error);

            await expect(controller.getUser(mockUser)).rejects.toThrow(error);
            expect(userService.findUser).toHaveBeenCalledWith({ id: mockUser.id });
        });
    });
}); 