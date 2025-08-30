import {
  IsOptional,
  IsUUID,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'generated/prisma';

export class OrdersQueryDto {
  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  anonymous_user_id?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order_number?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  total?: number;

  // фильтры по датам
  @IsOptional()
  @IsString()
  created_at?: string;

  @IsOptional()
  @IsString()
  updated_at?: string;

  // фильтры по вложенным айтемам
  @IsOptional()
  @IsUUID()
  product_variant_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  single_item_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  item_total?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
