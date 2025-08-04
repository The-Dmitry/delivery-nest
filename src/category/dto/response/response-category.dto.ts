import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Category } from 'generated/prisma';

export class ResponseCategoryDto implements Category {
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the category',
  })
  id: string;

  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the category',
  })
  name: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the category was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the category was last updated',
  })
  updatedAt: Date;
}

export const CategoryDtoResponse = createResponseDto(
  ResponseCategoryDto,
  'Category',
);

export const CategoryArrayDtoResponse = createResponseDto(
  [ResponseCategoryDto],
  'AllCategories',
);
