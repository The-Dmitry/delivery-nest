import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtAccessStrategy } from '@/common/strategies/jwt-access.strategy';
import { VariantsModule } from '@/variants/variants.module';

@Module({
  controllers: [CartController],
  providers: [CartService, JwtAccessStrategy],
  exports: [CartService],
  imports: [VariantsModule],
})
export class CartModule {}
