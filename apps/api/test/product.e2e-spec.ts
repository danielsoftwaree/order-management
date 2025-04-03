import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { MockPrismaService, mockPrismaClient } from '../src/prisma/__mocks__/prisma.service';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { ApiExceptionFilter } from '../src/common/filters/api-exception.filter';

describe('ProductController (e2e)', () => {
    let app: INestApplication;

    // Настройка приложения перед запуском тестов
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // Переопределяем PrismaService для использования мока
            .overrideProvider(PrismaService)
            .useClass(MockPrismaService)
            .compile();

        app = moduleFixture.createNestApplication();

        // Настраиваем приложение так же, как в main.ts
        app.useGlobalFilters(new ApiExceptionFilter());
        app.useGlobalInterceptors(new TransformInterceptor());
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        );

        await app.init();

        // Сбрасываем моки перед всеми тестами
        MockPrismaService.resetMocks();
    });

    beforeEach(() => {
        // Сбрасываем моки перед каждым тестом
        MockPrismaService.resetMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/products (GET)', () => {
        it('should return an array of products', async () => {
            // Подготовка тестовых данных
            const mockProducts = [
                { id: '1', name: 'Product 1', price: 100, stock: 10 },
                { id: '2', name: 'Product 2', price: 200, stock: 20 },
            ];

            // Настройка мока для возврата тестовых данных
            mockPrismaClient.product.findMany.mockResolvedValueOnce(mockProducts);

            // Выполнение запроса и проверка результатов
            return request(app.getHttpServer())
                .get('/products')
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toHaveLength(2);
                    expect(res.body.data[0].name).toBe('Product 1');
                    expect(res.body.data[1].name).toBe('Product 2');
                });
        });
    });

    describe('/products (POST)', () => {
        it('should create a new product', async () => {
            // Подготовка тестовых данных
            const productDto = { name: 'New Product', price: 150, stock: 5 };

            // Настройка моков
            mockPrismaClient.product.findUnique.mockResolvedValueOnce(null);
            mockPrismaClient.product.create.mockResolvedValueOnce({
                id: '3',
                ...productDto,
            });

            // Выполнение запроса и проверка результатов
            return request(app.getHttpServer())
                .post('/products')
                .send(productDto)
                .expect(201);
        });

        it('should return 400 if product already exists', async () => {
            // Подготовка тестовых данных
            const productDto = { name: 'Existing Product', price: 150, stock: 5 };
            const existingProduct = { id: '3', ...productDto };

            // Настройка мока findUnique, чтобы он возвращал существующий продукт
            mockPrismaClient.product.findUnique.mockResolvedValueOnce(existingProduct);

            // Выполнение запроса и проверка результатов
            return request(app.getHttpServer())
                .post('/products')
                .send(productDto)
                .expect(400);
        });

        it('should return 400 if validation fails', async () => {
            // Подготовка тестовых данных с неверным типом price
            const invalidProductDto = { name: 'Invalid Product', price: 'not-a-number', stock: 5 };

            // Выполнение запроса и проверка результатов
            return request(app.getHttpServer())
                .post('/products')
                .send(invalidProductDto)
                .expect(400);
        });
    });
}); 