import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class StatisticsBodyDto {
  @ApiPropertyOptional({
    description: 'Timezone offset in minutes',
    example: -180,
  })
  @IsOptional()
  @IsNumber()
  timezoneOffset?: number;

  @ApiPropertyOptional({
    description: 'Number of days to include in the statistics',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  daysCount?: number = 30;

  @ApiPropertyOptional({
    description: 'Include only completed orders info in the statistics',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
