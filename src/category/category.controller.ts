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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  CategoryResponse,
  CategoryWithQueriesArrayResponse,
  CategoryWithQueriesResponse,
  ResponseCategoryDto,
  ResponseCategoryWithQueries,
} from '@/category/dto/response/response-category.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import {
  DeleteDtoResponse,
  DeleteResponseDto,
} from '@/common/dto/delete-response.dto';
import { CategoryQueriesDto } from '@/category/dto/category-queries.dto';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ErrorResponseDto,
})
@ApiBearerAuth('access-token')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create a new category (admin only)',
  })
  @ApiCreatedResponse({
    description: 'Category created successfully',
    type: CategoryResponse,
  })
  @ApiConflictResponse({
    description: 'Category with the same name already exists',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ResponseCategoryDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get array of categories',
  })
  @ApiOkResponse({
    description: 'List of categories retrieved successfully',
    type: CategoryWithQueriesArrayResponse,
  })
  @SerializeResponse(ResponseCategoryWithQueries)
  @Get()
  async findAll(
    @Query() queries: CategoryQueriesDto,
  ): Promise<ResponseCategoryWithQueries[]> {
    return await this.categoryService.findAll(queries);
  }

  @ApiOperation({
    summary: 'Get a category by ID',
  })
  @ApiOkResponse({
    description: 'Category retrieved successfully',
    type: CategoryWithQueriesResponse,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ResponseCategoryWithQueries)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() queries: CategoryQueriesDto,
  ): Promise<ResponseCategoryWithQueries> {
    return await this.categoryService.findOne(id, queries);
  }

  @ApiOperation({
    summary: 'Update a category by ID (admin only)',
  })
  @ApiOkResponse({
    description: 'Category updated successfully',
    type: CategoryResponse,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Category with the same name already exists',
    type: ErrorResponseDto,
  })
  @SerializeResponse(ResponseCategoryDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'Delete a category by ID (admin only)',
  })
  @ApiOkResponse({
    description: 'Category deleted successfully',
    type: DeleteDtoResponse,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: DeleteDtoResponse,
  })
  @SerializeResponse(DeleteResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResponseDto> {
    return await this.categoryService.delete(id);
  }
}
