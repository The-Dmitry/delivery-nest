import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @ApiPropertyOptional({
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

  @ApiPropertyOptional({
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

  @ApiPropertyOptional({
    description: 'Customer phone number',
    example: '1234567890',
    required: false,
    minLength: 6,
    maxLength: 15,
  })
  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Phone must be at least 5 characters long' })
  @MaxLength(15, { message: 'Phone must be at most 15 characters long' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  phone?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'User password',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3, {
    message: 'Password must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters long',
  })
  password?: string;
}
