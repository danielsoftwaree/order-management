import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';

@Module({
  imports: [ProductModule, UserModule, OrderModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //
  // apply auth middleware to all routes
  // 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
