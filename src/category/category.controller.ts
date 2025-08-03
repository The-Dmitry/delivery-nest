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
import {
  AllCategoryDtoResponse,
  CategoryDtoResponse,
} from '@/category/dto/response/response-category.dto';

@ApiBadRequestResponse({
  description: 'Bad request',
  type: CategoryDtoResponse.error(),
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
    type: CategoryDtoResponse.success(),
  })
  @ApiConflictResponse({
    description: 'Category with the same name already exists',
    type: CategoryDtoResponse.error(),
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
    type: AllCategoryDtoResponse.success(),
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
    type: CategoryDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: CategoryDtoResponse.error(),
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
    type: CategoryDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: CategoryDtoResponse.error(),
  })
  @ApiConflictResponse({
    description: 'Category with the same name already exists',
    type: CategoryDtoResponse.error(),
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
    type: CategoryDtoResponse.success(),
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: CategoryDtoResponse.error(),
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(id);
  }
}
