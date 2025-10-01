import { Module } from '@nestjs/common';
import { WsOrdersGateway } from './ws-orders.gateway';
import { WsOrdersService } from '@/ws-orders/ws-orders.service';
import { JwtService } from '@jwt/jwt.service';

@Module({
  providers: [WsOrdersGateway, WsOrdersService, JwtService],
  exports: [WsOrdersGateway],
})
export class WsOrdersModule {}
