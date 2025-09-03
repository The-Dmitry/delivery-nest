import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrderDto extends PickType(UpdateUserDto, [
  'name',
  'address',
  'phone',
]) {
  @ApiPropertyOptional({
    description: 'Additional comments for the order',
    example: 'Please deliver between 5-6 PM',
    required: false,
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(400, { message: 'Comment must be at most 400 characters long' })
  comment?: string;
}
