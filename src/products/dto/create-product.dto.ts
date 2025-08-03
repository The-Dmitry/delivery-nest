import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'generated/prisma';

export class CreateProductDto
  implements Omit<Product, 'createdAt' | 'updatedAt' | 'active'>
{
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the product',
  })
  id: string;

  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description:
      'Unique identifier of the category to which the product belongs',
  })
  categoryId: string;

  @ApiProperty({
    example: 'Pizza',
    description: 'Name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Description of the product',
    description: 'Description of the product',
  })
  description: string | null;

  @ApiProperty({
    example: [
      'https://example.com/image.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'Image URL of the product',
  })
  images: string[];
}
