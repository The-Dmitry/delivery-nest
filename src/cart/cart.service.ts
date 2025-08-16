import { CreateCartItemDto } from '@/cart/dto/create-cart-item.dto';
import { UpdateCartItemDto } from '@/cart/dto/update-cart-item.dto';
import { FilteredCart } from '@/cart/models/models';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { JwtPayload } from '@jwt/models/models';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { Cart, Prisma } from 'generated/prisma';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

const CART_OPTIONS = {
  omit: {
    userId: true,
    anonymousUserId: true,
    createdAt: true,
    updatedAt: true,
  },
  include: {
    items: {
      omit: {
        cartId: true,
        productVariantId: true,
      },
      include: {
        productVariant: {
          include: {
            product: {
              omit: {
                updatedAt: true,
                createdAt: true,
                active: true,
                categoryId: true,
              },
            },
          },
        },
      },
    },
  },
} satisfies Omit<Prisma.CartFindUniqueArgs, 'where'>;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(payload: JwtPayload): Promise<FilteredCart> {
    try {
      return await this.findCart(payload, true);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to find cart for user with id: ${payload.id}`,
      );
    }
  }

  async addToCart(
    payload: JwtPayload,
    { quantity, variantId }: CreateCartItemDto,
  ): Promise<FilteredCart['items'][number]> {
    try {
      let cart = await this.findCart(payload);
      if (!cart) {
        cart = await this.createCart(payload);
      }
      for (const item of cart.items) {
        if (item.productVariant.id === variantId) {
          return await this.updateCartItemQuantity(
            payload,
            { quantity },
            item.id,
            cart,
          );
        }
      }
      return await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId: variantId,
          quantity,
        },
        ...CART_OPTIONS.include.items,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Cart for user with id '${payload.id}' not found.`,
          );
        }
      }
      throw new BadRequestException(
        `Failed to find cart for user with id: ${payload.id}`,
      );
    }
  }

  async updateCartItemQuantity(
    payload: JwtPayload,
    { quantity }: UpdateCartItemDto,
    cartItemId: string,
    cart?: FilteredCart,
  ): Promise<FilteredCart['items'][number]> {
    try {
      cart ??= await this.findCart(payload, true);
      return await this.prisma.cartItem.update({
        where: {
          id: cartItemId,
          cartId: cart.id,
        },
        data: {
          quantity,
        },
        ...CART_OPTIONS.include.items,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Cart item with id '${payload.id}' not found.`,
          );
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            `Cart for user with id '${payload.id}' not found.`,
          );
        }
      }
      throw new BadRequestException(
        `Failed to find cart for user with id: ${payload.id}`,
      );
    }
  }

  private async createCart({
    id,
    anonymous,
  }: JwtPayload): Promise<FilteredCart> {
    const data = {
      userId: anonymous ? null : id,
      anonymousUserId: anonymous ? id : null,
    } satisfies Pick<Cart, 'anonymousUserId' | 'userId'>;

    try {
      return await this.prisma.cart.create({
        data,
        ...CART_OPTIONS,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Cart already exists.');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(`User with id '${id}' not found.`);
        }
      }
      throw new BadRequestException('Failed to create cart.');
    }
  }

  async deleteCartItem(
    payload: JwtPayload,
    id: string,
  ): Promise<DeleteResponseDto> {
    try {
      const cart = await this.findCart(payload, true);
      if (cart.items.length === 1 && cart.items[0].id === id) {
        return await this.deleteCart(payload);
      }
      await this.prisma.cartItem.delete({
        where: {
          id,
          cartId: cart.id,
        },
        include: {
          productVariant: true,
        },
      });
      return {
        message: `Cart item with id ${id} deleted successfully`,
        deletedId: id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Cart for user with id '${payload.id}' not found.`,
          );
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(`Cart item with id '${id}' not found.`);
        }
      }
      throw new BadRequestException(
        `Failed to find cart for user with id: ${payload.id}`,
      );
    }
  }

  async deleteCart({ id, anonymous }: JwtPayload): Promise<DeleteResponseDto> {
    const user = anonymous ? { anonymousUserId: id } : { userId: id };
    try {
      const cart = await this.prisma.cart.delete({
        where: user,
      });
      return {
        message: `Cart with id ${cart.id} deleted successfully`,
        deletedId: cart.id,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Cart for user with id '${id}' not found.`,
          );
        }
      }
      throw new BadRequestException(
        `Failed to find cart for user with id: ${id}`,
      );
    }
  }

  private async findCart(
    payload: JwtPayload,
    withError: true,
  ): Promise<FilteredCart>;

  private async findCart(
    payload: JwtPayload,
    withError?: false,
  ): Promise<FilteredCart | null>;

  private async findCart({ id, anonymous }: JwtPayload, withError = false) {
    const user = anonymous ? { anonymousUserId: id } : { userId: id };
    const options = {
      where: user,
      ...CART_OPTIONS,
    } satisfies Prisma.CartFindUniqueArgs;
    try {
      if (withError) {
        return await this.prisma.cart.findUniqueOrThrow(options);
      }
      return await this.prisma.cart.findUnique(options);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `Cart for user with id '${id}' not found.`,
          );
        }
      }
      throw new BadRequestException(
        `Failed to find cart for user with id: ${id}`,
      );
    }
  }
}
