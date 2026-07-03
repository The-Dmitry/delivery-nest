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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  VariantResponse,
  VariantResponseDto,
  VariantArrayResponse,
} from '@/variants/dto/response/variants-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import {
  DeleteResponse,
  DeleteResponseDto,
} from '@/common/dto/delete-response.dto';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { VariantsQueriesDto } from '@/variants/dto/variants-queries.dto';

@ApiBearerAuth('access-token')
@ApiBadRequestResponse({
  description: 'Bad request',
  type: DeleteResponse,
})
@ApiTags('variants')
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @ApiOperation({
    summary: 'Create a new variant (admin only)',
  })
  @ApiCreatedResponse({
    description: 'Variant created successfully',
    type: VariantResponse,
  })
  @ApiNotFoundResponse({
    description: 'Product with id not found',
    type: DeleteResponse,
  })
  @SerializeResponse(VariantResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createVariantDto: CreateVariantDto,
  ): Promise<VariantResponseDto> {
    return await this.variantsService.create(createVariantDto);
  }

  @ApiOperation({
    summary: 'Get array of variants',
  })
  @ApiOkResponse({
    description: 'Variants found successfully',
    type: VariantArrayResponse,
  })
  @SerializeResponse(VariantResponseDto)
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() queries: VariantsQueriesDto,
  ): Promise<VariantResponseDto[]> {
    return await this.variantsService.findAll(queries);
  }

  @ApiOperation({
    summary: 'Get a variant by id',
  })
  @ApiOkResponse({
    description: 'Variant found successfully',
    type: VariantResponse,
  })
  @ApiNotFoundResponse({
    description: 'Variant with id not found',
    type: DeleteResponse,
  })
  @SerializeResponse(VariantResponseDto)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.variantsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a variant by id (admin only)',
  })
  @ApiOkResponse({
    description: 'Variant updated successfully',
    type: VariantResponse,
  })
  @ApiNotFoundResponse({
    description: 'Variant with id not found',
    type: DeleteResponse,
  })
  @SerializeResponse(VariantResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ): Promise<VariantResponseDto> {
    return await this.variantsService.update(id, updateVariantDto);
  }

  @ApiOperation({
    summary: 'Delete a variant by id (admin only)',
  })
  @ApiOkResponse({
    description: 'Variant deleted successfully',
    type: DeleteResponse,
  })
  @ApiNotFoundResponse({
    description: 'Variant with id not found',
    type: DeleteResponse,
  })
  @SerializeResponse(DeleteResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return await this.variantsService.remove(id);
  }
}
