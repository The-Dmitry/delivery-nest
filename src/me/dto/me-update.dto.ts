import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { PickType } from '@nestjs/swagger';

export class MeUpdateDto extends PickType(UpdateUserDto, [
  'address',
  'name',
  'phone',
]) {}
