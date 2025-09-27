import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Type } from 'class-transformer';

export class DailyOrders {
  @ApiProperty({
    example: '2023-10-01',
    description:
      'Date in YYYY-MM-DD format (client timezone if timezoneOffset provided in request body)',
  })
  date: string;

  @ApiProperty({
    example: 15,
    description: 'Number of orders on that date',
  })
  count: number;
}

export class StatisticsOrdersResponseDto {
  @ApiProperty({
    example: 450,
    description: 'Total number of orders in the specified period',
  })
  total: number;

  @ApiProperty({ type: DailyOrders })
  @Type(() => DailyOrders)
  days: DailyOrders[];
}

export const { StatisticsOrdersResponse } = createResponseDto(
  StatisticsOrdersResponseDto,
  'StatisticsOrders',
);
