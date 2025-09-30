import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsBodyDto } from '@/statistics/dto/statistics-body.dto';
import {
  StatisticsOrdersResponse,
  StatisticsOrdersResponseDto,
} from '@/statistics/dto/response/statistics-orders-response.dto';
import {
  StatisticsRevenueResponse,
  StatisticsRevenueResponseDto,
} from '@/statistics/dto/response/statistics-revenue-response.dto';
import {
  StatisticsCategoriesArrayResponse,
  StatisticsCategoriesResponseDto,
} from '@/statistics/dto/response/statistics-categories-response';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';

@JwtAuthorization()
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({ summary: 'Get orders statistics' })
  @ApiOkResponse({
    type: StatisticsOrdersResponse,
  })
  @SerializeResponse(StatisticsOrdersResponseDto)
  @HttpCode(HttpStatus.OK)
  @Post('orders')
  async getOrders(
    @Body() body: StatisticsBodyDto,
  ): Promise<StatisticsOrdersResponseDto> {
    return await this.statisticsService.getOrdersStatistics(body);
  }

  @ApiOperation({ summary: 'Get revenue statistics' })
  @ApiOkResponse({
    type: StatisticsRevenueResponse,
  })
  @SerializeResponse(StatisticsRevenueResponseDto)
  @HttpCode(HttpStatus.OK)
  @Post('revenue')
  async getRevenue(
    @Body() body: StatisticsBodyDto,
  ): Promise<StatisticsRevenueResponseDto> {
    return await this.statisticsService.getRevenueStatistics(body);
  }

  @ApiOperation({ summary: 'Get categories statistics' })
  @ApiOkResponse({
    type: StatisticsCategoriesArrayResponse,
  })
  @SerializeResponse(StatisticsCategoriesResponseDto)
  @HttpCode(HttpStatus.OK)
  @Post('categories')
  async getCategories(
    @Body() body: StatisticsBodyDto,
  ): Promise<StatisticsCategoriesResponseDto> {
    return await this.statisticsService.getCategoryStatistics(body);
  }
}
