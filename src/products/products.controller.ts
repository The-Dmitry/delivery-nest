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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  ProductDtoResponse,
  ProductResponseDto,
  ProductsArrayDtoResponse,
} from '@/products/dto/response/product-response.dto';
import {
  DeleteDtoResponse,
  DeleteResponseDto,
} from '@/common/dto/delete-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ProductDtoResponse.error(),
})
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create product', description: 'Create product' })
  @ApiCreatedResponse({
    description: 'Product created',
    type: ProductDtoResponse.success(),
  })
  @SerializeResponse(ProductResponseDto)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.create(createProductDto);
  }

  @ApiOperation({
    summary: 'Get all products',
    description: 'Get all products',
  })
  @ApiOkResponse({
    description: 'Products found',
    type: ProductsArrayDtoResponse.success(),
  })
  @SerializeResponse(ProductResponseDto)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    return await this.productsService.findAll();
  }

  @ApiOperation({
    summary: 'Get product by id',
    description: 'Get product by id',
  })
  @ApiOkResponse({
    description: 'Product found',
    type: ProductDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ProductDtoResponse.error(),
  })
  @SerializeResponse(ProductResponseDto)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return await this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get products by category id',
    description: 'Get products by category',
  })
  @ApiOkResponse({
    description: 'Products found',
    type: ProductsArrayDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: ProductDtoResponse.error(),
  })
  @SerializeResponse(ProductResponseDto)
  @Get('category/:id')
  async findAllByCategory(
    @Param('id') id: string,
  ): Promise<ProductResponseDto[]> {
    return await this.productsService.findAllByCategory(id);
  }

  @ApiOperation({
    summary: 'Update product by id',
    description: 'Update product by id',
  })
  @ApiOkResponse({
    description: 'Product updated',
    type: ProductDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ProductDtoResponse.error(),
  })
  @SerializeResponse(ProductResponseDto)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.update(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Delete product by id',
    description: 'Delete product by id',
  })
  @ApiOkResponse({
    description: 'Product deleted',
    type: DeleteDtoResponse,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ProductDtoResponse.error(),
  })
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(DeleteResponseDto)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResponseDto> {
    return await this.productsService.delete(id);
  }
}
