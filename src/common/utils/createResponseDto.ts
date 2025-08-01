import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function createResponseDto<T>(dto?: Type<T> | [Type<T>]) {
  return {
    success(className: string, code: number = 200) {
      class SuccessResponseDto {
        @ApiProperty({ example: 'ok', description: 'Response status' })
        status: string;

        @ApiProperty({ example: code, description: 'HTTP status code' })
        statusCode: number;

        @ApiProperty({ type: dto, description: 'Response data' })
        data: T;
      }

      Object.defineProperty(SuccessResponseDto, 'name', {
        value: `Success${className.charAt(0).toUpperCase()}${className.slice(1)}Dto_${code}`,
      });

      return SuccessResponseDto;
    },
    error(
      className: string,
      code: number = 404,
      message: string | string[] = ['Not found', 'An error occurred'],
    ) {
      class ErrorResponseDto {
        @ApiProperty({ example: 'error', description: 'Response status' })
        status: string;

        @ApiProperty({ example: code, description: 'HTTP status code' })
        statusCode: number;

        @ApiProperty({
          example: Array.isArray(message) ? message : [message],
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

      Object.defineProperty(ErrorResponseDto, 'name', {
        value: `Error${className.charAt(0).toUpperCase()}${className.slice(1)}Dto_${code}`,
      });

      return ErrorResponseDto;
    },
  };
}
