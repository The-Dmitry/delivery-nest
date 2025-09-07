import { CreateCartItemDto } from '@/cart/dto/create-cart-item.dto';
import { CartItemResponseDto } from '@/cart/dto/response/cart-item-response.dto';
import { CartResponseDto } from '@/cart/dto/response/cart-response.dto';
import { UpdateCartItemDto } from '@/cart/dto/update-cart-item.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { MakeFieldsOptional } from '@/common/types/partially-optional';
import { VariantsService } from '@/variants/variants.service';
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
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    },
  },
} satisfies Omit<Prisma.CartFindUniqueArgs, 'where'>;

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly variantsService: VariantsService,
  ) {}

  async getCart(payload: JwtPayload): Promise<CartResponseDto> {
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
  ): Promise<CartItemResponseDto> {
    try {
      const variant = await this.variantsService.findOne(variantId);
      if (!variant.available) {
        throw new BadRequestException(
          `Variant with id '${variantId}' is not available.`,
        );
      }
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
    cart?: Cart,
  ): Promise<CartItemResponseDto> {
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
  }: MakeFieldsOptional<
    JwtPayload,
    'role' | 'tokenType'
  >): Promise<CartResponseDto> {
    const data = {
      userId: anonymous ? null : id,
      anonymousUserId: anonymous ? id : null,
    } satisfies Pick<Cart, 'anonymousUserId' | 'userId'>;

    try {
      return await this.prisma.cart.create({
        data,
        include: {
          items: {
            include: {
              productVariant: {
                include: { product: true },
              },
            },
          },
        },
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
        throw new NotFoundException(`Cart item with id '${id}' not found.`);
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

  async mergeAnonymousCart(payload: JwtPayload, userId: string) {
    const [anonCart, userCart] = await Promise.all([
      this.findCart({ ...payload, anonymous: true }),
      this.findCart({ id: userId, anonymous: false }),
    ]);
    if (!anonCart) return;
    try {
      if (anonCart && !userCart) {
        return await this.prisma.cart.update({
          where: {
            id: anonCart.id,
          },
          data: {
            userId,
            anonymousUserId: null,
          },
        });
      }
      if (anonCart && userCart) {
        const existingVariants = new Set(
          userCart.items.map((i) => i.productVariantId),
        );

        const itemsToUpdate = anonCart.items.filter((item) =>
          existingVariants.has(item.productVariantId),
        );
        const itemsToCreate = anonCart.items.filter(
          (item) => !existingVariants.has(item.productVariantId),
        );
        const updatePromises = itemsToUpdate.map((item) =>
          this.prisma.cartItem.update({
            where: {
              cartId_productVariantId: {
                cartId: userCart.id,
                productVariantId: item.productVariantId,
              },
            },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          }),
        );
        const createPromises = itemsToCreate.map((item) =>
          this.prisma.cartItem.create({
            data: {
              cartId: userCart.id,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
            },
          }),
        );
        await Promise.all([...updatePromises, ...createPromises]);
        await this.prisma.cart.delete({
          where: {
            id: anonCart.id,
          },
        });
      }
    } catch {
      console.error('Failed to merge anonymous cart');
      return;
    }
  }

  private async findCart(
    payload: MakeFieldsOptional<JwtPayload, 'role' | 'tokenType'>,
    withError: true,
  ): Promise<CartResponseDto>;

  private async findCart(
    payload: MakeFieldsOptional<JwtPayload, 'role' | 'tokenType'>,
    withError?: false,
  ): Promise<CartResponseDto | null>;

  private async findCart(
    { id, anonymous }: MakeFieldsOptional<JwtPayload, 'role' | 'tokenType'>,
    withError = false,
  ) {
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
