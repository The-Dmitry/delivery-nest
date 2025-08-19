import { JwtPayload } from '@jwt/models/models';
import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Order, Prisma } from 'generated/prisma';
import { Decimal } from 'generated/prisma/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOrder({
    anonymous,
    id,
  }: JwtPayload): Promise<Pick<Order, 'orderNumber'>> {
    const userId = anonymous ? { anonymousUserId: id } : { userId: id };
    const cart = await this.prisma.cart.findUnique({
      where: {
        ...userId,
      },
      include: {
        items: {
          include: {
            productVariant: true,
          },
        },
      },
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    const orderItems = cart.items.map(
      ({ quantity, productVariant, productVariantId }) => ({
        quantity: quantity,
        priceAtPurchase: productVariant.price,
        productVariant: { connect: { id: productVariantId } },
        total: productVariant.price.times(quantity),
      }),
    ) satisfies Omit<Prisma.OrderItemCreateInput, 'order'>[];

    const total = orderItems.reduce((sum, item) => {
      const itemTotal = item.priceAtPurchase.times(item.quantity);
      return sum.plus(itemTotal);
    }, new Decimal(0));
    try {
      return await this.prisma.order.create({
        data: {
          total,
          ...userId,
          items: {
            create: orderItems,
          },
        },
        select: {
          orderNumber: true,
        },
      });
    } catch {
      throw new BadRequestException('Failed to create order');
    }
  }

  // private async recalculateItemTotalPrice() {

  // }
}
