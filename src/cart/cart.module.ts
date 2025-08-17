import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtAccessStrategy } from '@/common/strategies/jwt-access.strategy';

@Module({
  controllers: [CartController],
  providers: [CartService, JwtAccessStrategy],
})
export class CartModule {}
