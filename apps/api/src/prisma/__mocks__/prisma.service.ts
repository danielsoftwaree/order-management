import { PrismaClient } from '@prisma/client';

export const mockPrismaClient = {
    user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
        delete: jest.fn(),
    },
    product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    order: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
};

export class PrismaMock {
    constructor() {
        return mockPrismaClient;
    }
}

export class MockPrismaService {
    constructor() {
        return mockPrismaClient;
    }

    static resetMocks() {
        Object.values(mockPrismaClient).forEach((repository) => {
            if (typeof repository === 'object' && repository !== null) {
                Object.values(repository).forEach((method) => {
                    if (typeof method === 'function' && 'mockReset' in method) {
                        method.mockReset();
                    }
                });
            } else if (typeof repository === 'function' && 'mockReset' in repository) {
                repository.mockReset();
            }
        });
    }

    static mockReturnValueOnce(
        model: keyof typeof mockPrismaClient,
        method: string,
        value: any,
    ) {
        const modelObj = mockPrismaClient[model];
        if (modelObj && typeof modelObj === 'object' && method in modelObj) {
            const mockFn = modelObj[method] as jest.Mock;
            mockFn.mockReturnValueOnce(value);
        }
    }
} 