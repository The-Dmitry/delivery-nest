import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtPayload } from '@jwt/models/models';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';

@JwtAuthorization()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  async createOrder(@TokenPayload() payload: JwtPayload) {
    return await this.ordersService.createOrder(payload);
  }
}
