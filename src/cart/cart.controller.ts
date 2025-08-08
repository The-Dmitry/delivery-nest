import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtPayload } from '@jwt/models/models';
import { CreateCartItemDto } from '@/cart/dto/create-cart-item.dto';
import { UpdateCartItemDto } from '@/cart/dto/update-cart-item.dto';
import { CartResponseDto } from '@/cart/dto/response/cart-response.dto';
import { CartItemResponseDto } from '@/cart/dto/response/cart-item-response.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';

@JwtAuthorization()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async findOne(@TokenPayload() payload: JwtPayload): Promise<CartResponseDto> {
    return await this.cartService.getCart(payload);
  }

  @Post('add')
  async addToCart(
    @TokenPayload() payload: JwtPayload,
    @Body() dto: CreateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.addToCart(payload, dto);
  }

  @Patch('item/:id')
  async updateCartItem(
    @TokenPayload() payload: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.updateCartItemQuantity(payload, dto, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('item/:id')
  async deleteCartItem(
    @TokenPayload() payload: JwtPayload,
    @Param('id') id: string,
  ): Promise<DeleteResponseDto> {
    return await this.cartService.deleteCartItem(payload, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteCart(
    @TokenPayload() payload: JwtPayload,
  ): Promise<DeleteResponseDto> {
    return await this.cartService.deleteCart(payload);
  }
}
