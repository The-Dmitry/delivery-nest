import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { PickType } from '@nestjs/swagger';

export class MeUserResponseDto extends PickType(UserResponseDto, [
  'address',
  'email',
  'id',
  'name',
  'phone',
]) {}
