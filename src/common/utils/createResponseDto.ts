import { ApiProperty } from '@nestjs/swagger';
import { Type as DtoType } from '@nestjs/common';
import { ResultWithPagination } from '@/common/dto/result-with-pagination';
import { Type } from 'class-transformer';

class BaseResponse {
  @ApiProperty({ example: 'ok', description: 'Response status' })
  status: string;

  @ApiProperty({
    name: 'status_code',
    example: 200,
    description: 'HTTP status code',
  })
  statusCode: number;
}

export function createResponseDto<T, Name extends string>(
  dto: DtoType<T>,
  name: Name,
  pagination: boolean = false,
) {
  type ResponseDtoName = `${Name}Response`;
  type ResponseArrayDtoName = `${Name}ArrayResponse`;

  class SuccessDto extends BaseResponse {
    @ApiProperty({ type: () => dto, description: 'Response data' })
    data: T;
  }

  if (pagination) {
    class PaginationResponse extends ResultWithPagination {
      @ApiProperty({
        type: () => dto,
        description: 'Response data',
        isArray: true,
      })
      @Type(() => dto)
      data: T[];
    }

    Object.defineProperty(PaginationResponse, 'name', {
      value: `${name}PaginationResponse`,
    });

    class SuccessArrayWithPaginationDto extends BaseResponse {
      @ApiProperty({
        type: () => PaginationResponse,
        description: 'Response data',
        isArray: true,
      })
      @Type(() => PaginationResponse)
      result: PaginationResponse;
    }

    Object.defineProperty(SuccessDto, 'name', { value: `${name}Response` });
    Object.defineProperty(SuccessArrayWithPaginationDto, 'name', {
      value: `${name}ArrayResponse`,
    });

    return {
      [name + 'Response']: SuccessDto,
      [name + 'ArrayResponse']: SuccessArrayWithPaginationDto,
    } as {
      [K in ResponseDtoName]: typeof SuccessDto;
    } & {
      [K in ResponseArrayDtoName]: typeof SuccessArrayWithPaginationDto;
    };
  }

  class SuccessArrayDto extends BaseResponse {
    @ApiProperty({
      type: () => dto,
      description: 'Response data',
      isArray: true,
    })
    result: T[];
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
