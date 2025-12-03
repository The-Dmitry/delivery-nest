import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Role, User } from 'generated/prisma';

export class UserResponseDto implements User {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '2b3c4d5e-6f7g-8h9i-j0k1-l2m3n4o5p6q7',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'tDf0N@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, Anytown, USA',
    type: String,
    nullable: true,
  })
  address: string | null;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '1234567890',
    type: String,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Role of the user',
    example: 'USER',
    enum: Role,
  })
  role: Role;

  @ApiPropertyOptional({
    name: 'orders_count',
    description: 'Number of orders made by the user',
    type: Number,
    nullable: true,
    example: 5,
  })
  @Expose({ name: 'orders_count', toPlainOnly: true })
  @Transform(({ value }) => (value as { orders: number })?.orders, {
    toPlainOnly: true,
  })
  _count?: {
    orders: number;
  };
}

export const { UserResponse, UserArrayResponse } = createResponseDto(
  UserResponseDto,
  'User',
  true,
);
