import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  VariantDtoResponse,
  VariantResponseDto,
  VariantsArrayDtoResponse,
} from '@/variants/dto/response/variants-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import {
  DeleteDtoResponse,
  DeleteResponseDto,
} from '@/common/dto/delete-response.dto';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: VariantDtoResponse.error(),
})
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @ApiOperation({
    summary: 'Create a new variant',
    description: 'Create a new variant',
  })
  @ApiCreatedResponse({
    description: 'Variant created successfully',
    type: VariantDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Product with id not found',
    type: VariantDtoResponse.error(),
  })
  @SerializeResponse(VariantResponseDto)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<VariantResponseDto> {
    return await this.variantsService.create(createVariantDto);
  }

  @ApiOperation({
    summary: 'Get array of variants',
    description: 'Get all variants or variants by product id',
  })
  @ApiOkResponse({
    description: 'Variants found successfully',
    type: VariantsArrayDtoResponse.success(),
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    type: String,
    description: 'Filter products by product id',
  })
  @SerializeResponse(VariantResponseDto)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query('productId') productId?: string,
  ): Promise<VariantResponseDto[]> {
    return await this.variantsService.findAll(productId);
  }

  @ApiOperation({
    summary: 'Get a variant by id',
    description: 'Get a variant by id',
  })
  @ApiOkResponse({
    description: 'Variant found successfully',
    type: VariantDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Variant with id not found',
    type: VariantDtoResponse.error(),
  })
  @SerializeResponse(VariantResponseDto)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.variantsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a variant by id',
    description: 'Update a variant by id',
  })
  @ApiOkResponse({
    description: 'Variant updated successfully',
    type: VariantDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Variant with id not found',
    type: VariantDtoResponse.error(),
  })
  @SerializeResponse(VariantResponseDto)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<VariantResponseDto> {
    return await this.variantsService.update(id, updateVariantDto);
  }

  @ApiOperation({
    summary: 'Delete a variant by id',
    description: 'Delete a variant by id',
  })
  @ApiOkResponse({
    description: 'Variant deleted successfully',
    type: DeleteDtoResponse,
  })
  @ApiNotFoundResponse({
    description: 'Variant with id not found',
    type: VariantDtoResponse.error(),
  })
  @SerializeResponse(DeleteResponseDto)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return await this.variantsService.remove(id);
  }
}
