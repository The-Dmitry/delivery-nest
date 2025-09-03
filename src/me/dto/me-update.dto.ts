import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class MeUpdateDto extends PickType(UpdateUserDto, [
  'address',
  'name',
  'phone',
  'password',
]) {
  @ApiPropertyOptional({
    type: String,
    description: 'User confirmed password',
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
  newPassword?: string;
}
