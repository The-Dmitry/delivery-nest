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
import { createResponseDto } from '@utils/createResponseDto';
import { ResponseCategoryDto } from '@/category/dto/response/response-category.dto';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: createResponseDto().error('categories', 400, 'Invalid request data'),
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
    type: createResponseDto(ResponseCategoryDto).success('categories', 201),
  })
  @ApiConflictResponse({
    description: 'Category with the same name already exists',
    type: createResponseDto().error(
      'categories',
      409,
      'Category already exists',
    ),
  })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all categories',
  })
  @ApiOkResponse({
    description: 'List of categories retrieved successfully',
    type: createResponseDto([ResponseCategoryDto]).success('category', 200),
  })
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @ApiOperation({
    summary: 'Get a category by ID',
    description: 'Retrieves a category by its unique identifier',
  })
  @ApiOkResponse({
    description: 'Category retrieved successfully',
    type: createResponseDto(ResponseCategoryDto).success('category', 200),
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: createResponseDto().error('category', 404, 'Category not found'),
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates an existing category by its ID',
  })
  @ApiOkResponse({
    description: 'Category updated successfully',
    type: createResponseDto(ResponseCategoryDto).success(
      'category-update',
      200,
    ),
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: createResponseDto().error('category', 404, 'Category not found'),
  })
  @ApiConflictResponse({
    description: 'Category with the same name already exists',
    type: createResponseDto().error(
      'category-update',
      409,
      'Category with this name already exists',
    ),
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'Delete a category',
    description: 'Deletes a category by its unique identifier',
  })
  @ApiOkResponse({
    description: 'Category deleted successfully',
    type: createResponseDto().success('category-delete', 200),
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: createResponseDto().error(
      'category-delete',
      404,
      'Category not found',
    ),
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
