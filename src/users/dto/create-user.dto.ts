import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { User } from 'generated/prisma';

export class CreateUserDto
  implements Pick<User, 'name' | 'email' | 'password'>
{
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name for registration',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must be at most 50 characters long' })
  name: string;

  @ApiProperty({
    example: 'tDf0N@example.com',
    description: 'User email for registration',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password for registration',
    required: true,
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @MinLength(3, {
    message: 'Password must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters long',
  })
  password: string;
}

export const { CreateUserResponse } = createResponseDto(
  CreateUserDto,
  'CreateUser',
);
