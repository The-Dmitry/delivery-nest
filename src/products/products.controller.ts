import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  ProductResponse,
  ProductResponseDto,
  ProductWithCategoryAndVariantsCountDto,
  ProductWithQueriesArrayResponse,
  ProductWithQueriesResponse,
} from '@/products/dto/response/product-response.dto';
import {
  DeleteResponse,
  DeleteResponseDto,
} from '@/common/dto/delete-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import {
  ProductQueriesDto,
  ProductQueriesWithCategoryDto,
} from '@/products/dto/product-queries.dto';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { JwtPayload } from '@jwt/models/models';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ErrorResponseDto,
})
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create product (admin only)' })
  @ApiCreatedResponse({
    description: 'Product created',
    type: ProductResponse,
  })
  @SerializeResponse(ProductResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.create(createProductDto);
  }

  @ApiOperation({
    summary: 'Get all products',
  })
  @ApiOkResponse({
    description: 'Products found',
    type: ProductWithQueriesArrayResponse,
  })
  @SerializeResponse(ProductWithCategoryAndVariantsCountDto)
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() queries: ProductQueriesWithCategoryDto,
    @TokenPayload('role') role: JwtPayload['role'],
  ): Promise<ProductWithCategoryAndVariantsCountDto[]> {
    return await this.productsService.findAll(queries, role);
  }

  @ApiOperation({
    summary: 'Get product by id',
    description: 'Get product by id',
  })
  @ApiOkResponse({
    description: 'Product found',
    type: ProductWithQueriesResponse,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ProductWithCategoryAndVariantsCountDto)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() queries: ProductQueriesDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.findOne(id, queries);
  }

  @ApiOperation({
    summary: 'Update product by id (admin only)',
  })
  @ApiOkResponse({
    description: 'Product updated',
    type: ProductResponse,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ProductResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Delete product by id (admin only)',
  })
  @ApiOkResponse({
    description: 'Product deleted',
    type: DeleteResponse,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(DeleteResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResponseDto> {
    return await this.productsService.delete(id);
  }
}
