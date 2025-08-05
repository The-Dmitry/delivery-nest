import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  async create(@Body() createVariantDto: CreateVariantDto) {
    return await this.variantsService.create(createVariantDto);
  }

  @Get()
  async findAll() {
    return await this.variantsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.variantsService.findOne(id);
  }

  @Get('product/:id')
  async findByProductId(@Param('id') id: string) {
    return await this.variantsService.findByProductId(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return await this.variantsService.update(id, updateVariantDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.variantsService.remove(id);
  }
}
