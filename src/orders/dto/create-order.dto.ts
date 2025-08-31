import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name?: string;

  @ApiProperty({
    description: 'Customer address',
    example: '123 Main St, Springfield',
    required: false,
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  @MaxLength(100, { message: 'Address must be at most 100 characters long' })
  address?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+1234567890',
    required: false,
    minLength: 6,
    maxLength: 15,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Phone must be at least 5 characters long' })
  @MaxLength(15, { message: 'Phone must be at most 15 characters long' })
  phone?: string;

  @ApiProperty({
    description: 'Additional comments for the order',
    example: 'Please deliver between 5-6 PM',
    required: false,
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(400, { message: 'Comment must be at most 400 characters long' })
  comment?: string;
}
