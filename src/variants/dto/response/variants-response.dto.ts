import { CreateVariantDto } from '@/variants/dto/create-variant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { ProductVariant } from 'generated/prisma';

export class VariantResponseDto
  extends CreateVariantDto
  implements ProductVariant
{
  @ApiProperty({
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the variant',
  })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the variant is available or not',
  })
  available: boolean;
}

export const VariantDtoResponse = createResponseDto(
  VariantResponseDto,
  'Variant',
);

export const VariantsArrayDtoResponse = createResponseDto(
  [VariantResponseDto],
  'VariantsArray',
);
