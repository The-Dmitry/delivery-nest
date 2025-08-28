import { User } from 'generated/prisma';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserDto implements Partial<Pick<User, 'phone' | 'address'>> {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  @MaxLength(100, { message: 'Address must be at most 100 characters long' })
  address?: string;
}
