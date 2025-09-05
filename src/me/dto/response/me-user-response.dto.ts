import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { PickType } from '@nestjs/swagger';
import { createResponseDtoTemp } from '@utils/createResponseDto';
import { Exclude } from 'class-transformer';
import { Role } from 'generated/prisma';

export class MeUserResponseDto extends PickType(UserResponseDto, [
  'address',
  'name',
  'phone',
  'email',
]) {
  @Exclude()
  id?: string;

  @Exclude()
  password?: string;

  @Exclude()
  role?: Role;
}

export const { MeUserResponse } = createResponseDtoTemp(
  MeUserResponseDto,
  'MeUser',
);
