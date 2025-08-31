import { User } from 'generated/prisma';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto implements Partial<Pick<User, 'phone' | 'address'>> {
  @IsString()
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.replace(/\D/g, '') : value,
  )
  phone?: string;

  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  @MaxLength(100, { message: 'Address must be at most 100 characters long' })
  address?: string;
}
