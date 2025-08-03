import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';

export function createResponseDto<T>(dto: Type<T> | [Type<T>], name: string) {
  class SuccessResponseDto {
    @ApiProperty({ example: 'ok', description: 'Response status' })
    status: string;

    @ApiProperty({ example: 200, description: 'HTTP status code' })
    statusCode: number;

    @ApiProperty({ type: dto, description: 'Response data' })
    data: T;
  }

  Object.defineProperty(SuccessResponseDto, 'name', {
    value: `${name}Response`,
  });

  return {
    success() {
      return SuccessResponseDto;
    },
    error() {
      return ErrorResponseDto;
    },
  };
}
