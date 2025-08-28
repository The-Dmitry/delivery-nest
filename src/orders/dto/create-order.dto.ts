import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  @MaxLength(100, { message: 'Address must be at most 100 characters long' })
  address?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Phone must be at least 5 characters long' })
  @MaxLength(15, { message: 'Phone must be at most 15 characters long' })
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Comment must be at most 200 characters long' })
  comment?: string;
}
