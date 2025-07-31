import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRegistrationDto {
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
