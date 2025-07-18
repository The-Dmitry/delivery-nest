import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(3, {
    message: 'Password must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters long',
  })
  password: string;
}
