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

@ApiBadRequestResponse({
  description: 'Bad request',
  type: ErrorResponseDto,
})
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new category with the provided name',
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
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all categories',
  })
  @ApiOkResponse({
    description: 'List of categories retrieved successfully',
    type: CategoryWithQueriesArrayResponse,
  })
  @SerializeResponse(ResponseCategoryWithQueries)
  @Get()
  async findAll(
    @Query() { count, products }: CategoryQueriesDto,
  ): Promise<ResponseCategoryWithQueries[]> {
    return await this.categoryService.findAll(count, products);
  }

  @ApiOperation({
    summary: 'Get a category by ID',
    description: 'Retrieves a category by its unique identifier',
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
    @Query() { count, products }: CategoryQueriesDto,
  ): Promise<ResponseCategoryWithQueries> {
    return await this.categoryService.findOne(id, count, products);
  }

  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates an existing category by its ID',
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
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'Delete a category',
    description: 'Deletes a category by its unique identifier',
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
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResponseDto> {
    return await this.categoryService.delete(id);
  }
}
