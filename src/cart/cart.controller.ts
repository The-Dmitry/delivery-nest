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
import {
  CartResponse,
  CartResponseDto,
} from '@/cart/dto/response/cart-response.dto';
import {
  CartItemResponse,
  CartItemResponseDto,
} from '@/cart/dto/response/cart-item-response.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ErrorResponseDto,
})
@ApiNotFoundResponse({
  description: 'Cart not found',
  type: ErrorResponseDto,
})
@ApiBearerAuth('access-token')
@JwtAuthorization()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Get cart',
  })
  @ApiOkResponse({
    description: 'Cart of the authenticated user',
    type: CartResponse,
  })
  @SerializeResponse(CartResponseDto)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCart(@TokenPayload() payload: JwtPayload): Promise<CartResponseDto> {
    return await this.cartService.getCart(payload);
  }

  @ApiOperation({
    summary: 'Add item to cart',
  })
  @ApiCreatedResponse({
    description: 'Item added to cart',
    type: CartItemResponse,
  })
  @SerializeResponse(CartItemResponseDto)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async addToCart(
    @TokenPayload() payload: JwtPayload,
    @Body() dto: CreateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.addToCart(payload, dto);
  }

  @ApiOperation({
    summary: 'Update item in cart',
  })
  @ApiOkResponse({
    description: 'Item updated in cart',
    type: CartItemResponse,
  })
  @SerializeResponse(CartItemResponseDto)
  @HttpCode(HttpStatus.OK)
  @Patch('item/:id')
  async updateCartItem(
    @TokenPayload() payload: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.updateCartItemQuantity(payload, dto, id);
  }

  @ApiOperation({
    summary: 'Delete item from cart',
  })
  @ApiOkResponse({
    description: 'Item deleted from cart',
    type: DeleteResponseDto,
  })
  @SerializeResponse(DeleteResponseDto)
  @HttpCode(HttpStatus.OK)
  @Delete('item/:id')
  async deleteCartItem(
    @TokenPayload() payload: JwtPayload,
    @Param('id') id: string,
  ): Promise<DeleteResponseDto> {
    return await this.cartService.deleteCartItem(payload, id);
  }

  @ApiOperation({
    summary: 'Delete cart',
  })
  @ApiOkResponse({
    description: 'Cart deleted',
    type: DeleteResponseDto,
  })
  @SerializeResponse(DeleteResponseDto)
  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteCart(
    @TokenPayload() payload: JwtPayload,
  ): Promise<DeleteResponseDto> {
    return await this.cartService.deleteCart(payload);
  }
}
