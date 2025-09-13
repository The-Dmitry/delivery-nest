import { PaginationQueriesDto } from '@/common/dto/pagination-queries.dto';
import { SingleUserQueriesDto } from '@/users/dto/single-user-queries.dto';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { Role } from 'generated/prisma';

export class AllUsersQueriesDto extends IntersectionType(
  PaginationQueriesDto,
  SingleUserQueriesDto,
) {
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
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either USER or ADMIN' })
  role?: Role;
}
