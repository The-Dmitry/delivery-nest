import { WithPagination } from '@/common/types/pagination';
import { MeChangePasswordDto } from '@/me/dto/me-change-password.dto';
import { MeOrdersQueryDto } from '@/me/dto/me-orders-queries.dto';
import { MeUpdateDto } from '@/me/dto/me-update.dto';
import { ResponseOrderDto } from '@/orders/dto/response/response-order.dto';
import { OrdersService } from '@/orders/orders.service';
import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { verify } from 'argon2';

@Injectable()
export class MeService {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  async getMe(id: string): Promise<UserResponseDto> {
    return await this.usersService.findById(id);
  }

  async updateMe(id: string, data: MeUpdateDto) {
    return await this.usersService.update(id, data);
  }

  async changePassword(
    id: string,
    { password, newPassword }: MeChangePasswordDto,
  ) {
    if (!(password && newPassword)) {
      throw new BadRequestException('Password and new password are required');
    }
    const currentUser = await this.usersService.findById(id);
    const isOldPasswordValid = await verify(currentUser.password, password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    await this.usersService.update(id, {
      password: newPassword,
    });
    return {
      message: 'Password changed successfully',
      passwordChanged: true,
    };
  }

  async getMyOrders(
    id: string,
    queries: MeOrdersQueryDto,
  ): Promise<WithPagination<ResponseOrderDto>> {
    return await this.ordersService.findManyOrders({ userId: id, ...queries });
  }

  async cancelOrder(
    userId: string,
    orderId: string,
  ): Promise<ResponseOrderDto> {
    const order = await this.ordersService.findOneOrder(orderId, {});
    if (order.status !== 'NEW') {
      throw new BadRequestException('Order is in progress or already canceled');
    }
    if (order.userId !== userId) {
      throw new BadRequestException('You are not allowed to cancel this order');
    }
    return await this.ordersService.updateOrder(
      orderId,
      {
        canceledByUser: true,
      },
      true,
    );
  }
}
