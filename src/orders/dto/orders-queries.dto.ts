import { IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { OrderStatus } from 'generated/prisma';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { ToBoolean } from '@/common/decorators/to-boolean.decorator';
import { PaginationQueriesDto } from '@/common/dto/pagination-queries.dto';

export class OneOrderQueryDto {
  @ApiPropertyOptional({
    description: 'Include items data for each order',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @ToBoolean()
  items?: boolean;

  @ApiPropertyOptional({
    description: 'Include variants data for each item',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @ToBoolean()
  variant?: boolean;

  @ApiPropertyOptional({
    description: 'Include variants data for each item',
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @ToBoolean()
  product?: boolean;
}

export class ManyOrdersQueryDto extends IntersectionType(
  OneOrderQueryDto,
  PaginationQueriesDto,
) {
  @ApiPropertyOptional({
    name: 'show_all',
    description: 'Show all orders (default: false, true is only for admin)',
    type: Boolean,
    example: true,
    required: false,
  })
  @ToBoolean()
  @IsOptional()
  @Expose({ name: 'show_all' })
  showAll?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by user id',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Expose({ name: 'user_id' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by name',
    example: 'John Doe',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by phone number',
    example: '375441122333',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'PENDING',
    required: false,
    enum: OrderStatus,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Filter by created from date',
    example: '2023-05-01T00:00:00.000Z',
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @ApiPropertyOptional({
    description: 'Filter by created to date',
    example: '2023-05-01T00:00:00.000Z',
    required: false,
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;
}
