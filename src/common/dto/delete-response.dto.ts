import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose } from 'class-transformer';

export class DeleteResponseDto {
  @ApiProperty({
    example: 'Product deleted successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    name: 'deleted_id',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    description: 'Unique identifier of the deleted product',
  })
  @Expose({ name: 'deleted_id', toPlainOnly: true })
  deletedId: string;
}

export const { DeleteResponse } = createResponseDto(
  DeleteResponseDto,
  'Delete',
);
