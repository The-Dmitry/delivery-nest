import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from 'generated/prisma/runtime/library';
import { StatisticsBodyDto } from '@/statistics/dto/statistics-body.dto';
import {
  DailyOrders,
  StatisticsOrdersResponseDto,
} from '@/statistics/dto/response/statistics-orders-response.dto';
import {
  DailyRevenue,
  StatisticsRevenueResponseDto,
} from '@/statistics/dto/response/statistics-revenue-response.dto';
import { StatisticsCategoriesResponseDto } from '@/statistics/dto/response/statistics-categories-response';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrdersStatistics({
    daysCount,
    timezoneOffset,
    completed,
  }: StatisticsBodyDto): Promise<StatisticsOrdersResponseDto> {
    const days = this.generateDaysRange(daysCount);
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: days[0] },
        status: completed ? 'DELIVERED' : undefined,
      },
      select: { createdAt: true },
    });

    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      const dateStr = this.toLocalDateString(o.createdAt, timezoneOffset);
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    });

    const dayCounts: DailyOrders[] = days.map((d) => {
      const dateStr = this.toLocalDateString(d, timezoneOffset);
      return { date: dateStr, count: counts[dateStr] || 0 };
    });

    const total = orders.length;

    return { total, days: dayCounts };
  }

  async getRevenueStatistics({
    daysCount,
    timezoneOffset,
    completed,
  }: StatisticsBodyDto): Promise<StatisticsRevenueResponseDto> {
    console.log(completed, '');

    const days = this.generateDaysRange(daysCount);
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: days[0] },
        status: completed ? 'DELIVERED' : undefined,
      },
      select: { createdAt: true, total: true },
    });

    const revenues: Record<string, Decimal> = {};
    let totalRevenue = new Decimal(0);

    orders.forEach((o) => {
      const dateStr = this.toLocalDateString(o.createdAt, timezoneOffset);
      revenues[dateStr] = (revenues[dateStr] || new Decimal(0)).plus(
        new Decimal(o.total),
      );
      totalRevenue = totalRevenue.plus(new Decimal(o.total));
    });

    const dayRevenues: DailyRevenue[] = days.map((d) => {
      const dateStr = this.toLocalDateString(d, timezoneOffset);
      return { date: dateStr, revenue: revenues[dateStr] || new Decimal(0) };
    });

    return { total: totalRevenue, days: dayRevenues };
  }

  async getCategoryStatistics({
    daysCount,
    completed,
  }: StatisticsBodyDto): Promise<StatisticsCategoriesResponseDto> {
    const start = this.generateDaysRange(daysCount)[0];
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start },
        status: completed ? 'DELIVERED' : undefined,
      },
      select: {
        createdAt: true,
        items: {
          select: {
            quantity: true,
            productVariant: {
              select: {
                product: {
                  select: { category: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
    });

    const data: Record<string, number> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const { quantity, productVariant } = item;
        const category = productVariant.product.category.name;
        if (category in data) {
          data[category] += quantity;
        } else {
          data[category] = quantity;
        }
      });
    });

    return { data };
  }

  private generateDaysRange(daysCount: number = 30): Date[] {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - (daysCount - 1));

    const days: Date[] = [];
    for (let d = new Date(fromDate); d <= today; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }

  private toLocalDateString(date: Date, timezoneOffset: number = 0): string {
    const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  }
}
