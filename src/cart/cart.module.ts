import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { VariantsModule } from '@/variants/variants.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
  imports: [VariantsModule],
})
export class CartModule {}
