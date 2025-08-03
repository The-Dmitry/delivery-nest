import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 'error', description: 'Response status' })
  status: string;

  @ApiProperty({ example: 404, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: ['Not found', 'An error occurred'],
    description: 'Error message',
    type: [String],
  })
  message: string[];

  @ApiProperty({
    example: 'Error type',
    description: 'Error type',
  })
  error: string;
}
