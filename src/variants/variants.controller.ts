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
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { Role } from 'generated/prisma';
import { VariantsQueriesDto } from '@/variants/dto/variants-queries.dto';

@ApiBearerAuth('access-token')
@ApiBadRequestResponse({
  description: 'Bad request',
  type: VariantDtoResponse.error(),
})
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @ApiOperation({
    summary: 'Create a new variant (admin only)',
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
    type: VariantsArrayDtoResponse.success(),
  })
  @SerializeResponse(VariantResponseDto)
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @TokenPayload('role') role: Role,
    @Query() queries: VariantsQueriesDto,
  ): Promise<VariantResponseDto[]> {
    return await this.variantsService.findAll(queries, role);
  }

  @ApiOperation({
    summary: 'Get a variant by id',
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
    summary: 'Update a variant by id (admin only)',
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
    type: DeleteDtoResponse,
  })
  @ApiNotFoundResponse({
    description: 'Variant with id not found',
    type: VariantDtoResponse.error(),
  })
  @SerializeResponse(DeleteResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResponseDto> {
    return await this.variantsService.remove(id);
  }
}
