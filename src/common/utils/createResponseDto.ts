import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function createResponseDto<T, Name extends string>(
  dto: Type<T>,
  name: Name,
) {
  type ResponseDtoName = `${Name}Response`;
  type ResponseArrayDtoName = `${Name}ArrayResponse`;

  class SuccessDto {
    @ApiProperty({ example: 'ok', description: 'Response status' })
    status: string;

    @ApiProperty({
      name: 'status_code',
      example: 200,
      description: 'HTTP status code',
    })
    statusCode: number;

    @ApiProperty({ type: dto, description: 'Response data' })
    data: T;
  }

  class SuccessArrayDto {
    @ApiProperty({ example: 'ok', description: 'Response status' })
    status: string;

    @ApiProperty({
      name: 'status_code',
      example: 200,
      description: 'HTTP status code',
    })
    statusCode: number;

    @ApiProperty({ type: dto, description: 'Response data', isArray: true })
    data: T[];
  }

  Object.defineProperty(SuccessDto, 'name', { value: `${name}Response` });
  Object.defineProperty(SuccessArrayDto, 'name', {
    value: `${name}ArrayResponse`,
  });

  return {
    [name + 'Response']: SuccessDto,
    [name + 'ArrayResponse']: SuccessArrayDto,
  } as {
    [K in ResponseDtoName]: typeof SuccessDto;
  } & {
    [K in ResponseArrayDtoName]: typeof SuccessArrayDto;
  };
}
