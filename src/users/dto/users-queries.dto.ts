import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Role } from 'generated/prisma';

export class UsersQueriesDto {
  @ApiPropertyOptional({
    description: 'Filter by email',
    type: String,
    required: false,
  })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filter by name',
    type: String,
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by phone',
    type: String,
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    type: String,
    enum: Role,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  role?: Role;
}
