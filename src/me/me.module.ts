import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { UsersModule } from '@/users/users.module';
import { OrdersModule } from '@/orders/orders.module';

@Module({
  controllers: [MeController],
  providers: [MeService],
  imports: [UsersModule, OrdersModule],
})
export class MeModule {}
