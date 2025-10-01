import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '@/cart/cart.module';
import { WsOrdersModule } from '@/ws-orders/ws-orders.module';

@Module({
  imports: [CartModule, WsOrdersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
