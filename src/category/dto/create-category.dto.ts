import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from 'generated/prisma';

export class CreateCategoryDto implements Pick<Category, 'name'> {
  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
