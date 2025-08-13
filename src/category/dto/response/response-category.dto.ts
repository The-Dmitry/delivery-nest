import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose } from 'class-transformer';
import { Category } from 'generated/prisma';

export class ResponseCategoryDto implements Category {
  // constructor(partial: Partial<ResponseCategoryDto>) {
  //   Object.assign(this, partial);
  // }

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
    name: 'created_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the category was created',
  })
  @Expose({ name: 'created_at', toPlainOnly: true })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    example: '2023-10-01T12:00:00Z',
    description: 'The date and time when the category was last updated',
  })
  @Expose({ name: 'updated_at', toPlainOnly: true })
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
