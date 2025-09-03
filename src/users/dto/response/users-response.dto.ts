import { ApiProperty } from '@nestjs/swagger';
import { createResponseDtoTemp } from '@utils/createResponseDto';
import { Expose } from 'class-transformer';
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
  })
  address: string | null;

  @Expose()
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '1234567890',
  })
  phone: string | null;

  @ApiProperty({
    description: 'Role of the user',
    example: 'USER',
    enum: Role,
  })
  role: Role;
}

export const { UserResponse, UserArrayResponse } = createResponseDtoTemp(
  UserResponseDto,
  'User',
);
