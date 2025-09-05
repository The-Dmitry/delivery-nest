import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from './jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './env/env.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { MeModule } from '@/me/me.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EnvModule,
    CategoryModule,
    ProductsModule,
    VariantsModule,
    CartModule,
    OrdersModule,
    UsersModule,
    MeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
