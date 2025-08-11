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
  CartDtoResponse,
  CartResponseDto,
} from '@/cart/dto/response/cart-response.dto';
import {
  CartItemDtoResponse,
  CartItemResponseDto,
} from '@/cart/dto/response/cart-item-response.dto';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: CartDtoResponse.error(),
})
@ApiNotFoundResponse({
  description: 'Cart not found',
  type: CartDtoResponse.error(),
})
@ApiBearerAuth('access-token')
@JwtAuthorization()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({
    summary: 'Get cart',
    description: 'Get cart of the authenticated user',
  })
  @ApiOkResponse({
    description: 'Cart of the authenticated user',
    type: CartDtoResponse.success(),
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findOne(@TokenPayload() payload: JwtPayload): Promise<CartResponseDto> {
    return await this.cartService.getCart(payload);
  }

  @ApiOperation({
    summary: 'Add item to cart',
    description: 'Add item to cart of the authenticated user',
  })
  @ApiCreatedResponse({
    description: 'Item added to cart',
    type: CartItemDtoResponse.success(),
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('add')
  async addToCart(
    @TokenPayload() payload: JwtPayload,
    @Body() dto: CreateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.addToCart(payload, dto);
  }

  @ApiOperation({
    summary: 'Update item in cart',
    description: 'Update item in cart of the authenticated user',
  })
  @ApiOkResponse({
    description: 'Item updated in cart',
    type: CartItemDtoResponse.success(),
  })
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
    description: 'Delete item from cart of the authenticated user',
  })
  @ApiNoContentResponse({
    description: 'Item deleted from cart',
    type: DeleteResponseDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('item/:id')
  async deleteCartItem(
    @TokenPayload() payload: JwtPayload,
    @Param('id') id: string,
  ): Promise<DeleteResponseDto> {
    return await this.cartService.deleteCartItem(payload, id);
  }

  @ApiOperation({
    summary: 'Delete cart',
    description: 'Delete cart of the authenticated user',
  })
  @ApiNoContentResponse({
    description: 'Cart deleted',
    type: DeleteResponseDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteCart(
    @TokenPayload() payload: JwtPayload,
  ): Promise<DeleteResponseDto> {
    return await this.cartService.deleteCart(payload);
  }
}
