import { Test } from '@nestjs/testing';
import {
  INestApplication,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

import { SwaggerOnlyModule } from './swagger.module';

import { AuthService } from './auth/auth.service';
import { CartService } from './cart/cart.service';
import { OrdersService } from './orders/orders.service';
import { UsersService } from './users/users.service';
import { MeService } from './me/me.service';
import { CategoryService } from './category/category.service';
import { ProductsService } from './products/products.service';
import { VariantsService } from './variants/variants.service';
import { JwtService } from '@nestjs/jwt';
import { OptionalJwtGuard } from './common/guards/jwt-option.guard';

@Injectable()
class MockOptionalJwtGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

async function generateSwagger() {
  const moduleRef = await Test.createTestingModule({
    imports: [SwaggerOnlyModule],
  })
    .overrideProvider(AuthService)
    .useValue({})
    .overrideProvider(CartService)
    .useValue({})
    .overrideProvider(OrdersService)
    .useValue({})
    .overrideProvider(UsersService)
    .useValue({})
    .overrideProvider(MeService)
    .useValue({})
    .overrideProvider(CategoryService)
    .useValue({})
    .overrideProvider(ProductsService)
    .useValue({})
    .overrideProvider(VariantsService)
    .useValue({})
    .overrideProvider(JwtService)
    .useValue({
      sign: () => 'mocked-token',
      verify: () => ({}),
      decode: () => ({}),
    })
    .overrideGuard(OptionalJwtGuard)
    .useClass(MockOptionalJwtGuard)
    .compile();

  const app: INestApplication = moduleRef.createNestApplication();

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync('./src/swagger.json', JSON.stringify(document, null, 2));
  console.log('✅ Swagger JSON has been generated: swagger.json');

  await app.close();
}

generateSwagger();
