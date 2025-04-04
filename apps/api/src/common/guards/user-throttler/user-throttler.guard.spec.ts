import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../../../app.module';
import { ConfigService } from '@nestjs/config';

describe('UserThrottlerGuard (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let configService: ConfigService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        jwtService = moduleFixture.get<JwtService>(JwtService);
        configService = moduleFixture.get<ConfigService>(ConfigService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should limit the number of requests for a user', async () => {
        const testUser = { id: '8677b802-4b87-4ed9-82ef-96f31a5504a5', email: 'test@example.com' };

        const jwtSecret = configService.get<string>('JWT_SECRET');

        const token = jwtService.sign(testUser, { secret: jwtSecret });

        const testUrl = '/products';

        const promises: Promise<request.Response>[] = [];
        for (let i = 0; i < 15; i++) {
            promises.push(
                request(app.getHttpServer())
                    .get(testUrl)
                    .set('Authorization', `Bearer ${token}`)
            );
        }

        const responses = await Promise.all(promises);

        const blockedRequests = responses.filter(res => res.status === 429);
        expect(blockedRequests.length).toBeGreaterThan(0);

        if (blockedRequests.length > 0) {
            expect(blockedRequests[0].body).toHaveProperty('message', 'Too many requests. Please wait a moment.');
        }
    });
}); 