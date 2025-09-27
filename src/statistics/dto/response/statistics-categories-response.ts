import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';

export class StatisticsCategoriesResponseDto {
  @ApiProperty({
    example: '2023-10-01',
    type: Object,
    additionalProperties: { type: 'number' },
    description:
      'Date in YYYY-MM-DD format (client timezone if timezoneOffset provided in request body)',
    examples: {
      Beverages: 150,
      Snacks: 200,
      Desserts: 75,
    },
  })
  data: Record<string, number>;
}

export const { StatisticsCategoriesArrayResponse } = createResponseDto(
  StatisticsCategoriesResponseDto,
  'StatisticsCategories',
);
