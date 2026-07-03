import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Type } from 'class-transformer';
import { Decimal } from 'generated/prisma/runtime/library';

export class DailyRevenue {
  @ApiProperty({
    example: '2023-10-01',
    description:
      'Date in YYYY-MM-DD format (client timezone if timezoneOffset provided in request body)',
  })
  date: string;

  @ApiProperty({
    example: 15,
    description: 'Number (Decimal) of orders on that date',
    type: String,
  })
  @Type(() => String)
  revenue: Decimal;
}

export class StatisticsRevenueResponseDto {
  @ApiProperty({
    example: 450,
    description: 'Total number of orders in the specified period',
    type: String,
  })
  @Type(() => String)
  total: Decimal;

  @ApiProperty({ type: DailyRevenue })
  @Type(() => DailyRevenue)
  days: DailyRevenue[];
}

export const { StatisticsRevenueResponse } = createResponseDto(
  StatisticsRevenueResponseDto,
  'StatisticsRevenue',
);
