// swagger.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { CartController } from './cart/cart.controller';
import { OrdersController } from './orders/orders.controller';
import { UsersController } from './users/users.controller';
import { MeController } from './me/me.controller';
import { CategoryController } from './category/category.controller';
import { ProductsController } from './products/products.controller';

import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart.service';
import { OrdersService } from './orders/orders.service';
import { UsersService } from './users/users.service';
import { MeService } from './me/me.service';
import { CategoryService } from './category/category.service';
import { ProductsService } from './products/products.service';
import { VariantsService } from './variants/variants.service';
import { JwtService } from '@nestjs/jwt';
import { VariantsController } from './variants/variants.controller';

@Module({
  controllers: [
    AuthController,
    CartController,
    OrdersController,
    UsersController,
    MeController,
    CategoryController,
    VariantsController,
    ProductsController,
  ],
  providers: [
    { provide: AuthService, useValue: {} },
    { provide: CartService, useValue: {} },
    { provide: OrdersService, useValue: {} },
    { provide: UsersService, useValue: {} },
    { provide: MeService, useValue: {} },
    { provide: CategoryService, useValue: {} },
    { provide: VariantsService, useValue: {} },
    { provide: ProductsService, useValue: {} },
    {
      provide: JwtService,
      useValue: { sign: () => 'mock', verify: () => ({}) },
    },
  ],
})
export class SwaggerOnlyModule {}
