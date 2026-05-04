import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from 'generated/prisma';

export class CreateCategoryDto
  implements Pick<Category, 'name' | 'linkName' | 'image'>
{
  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'pizza',
    description: 'Link name of the category',
  })
  @IsString()
  @IsNotEmpty()
  linkName: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/pizza.jpg',
    description: 'Image URL for the category',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  image: string | null;
}
