import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { PickType } from '@nestjs/swagger';
import { createResponseDtoTemp } from '@utils/createResponseDto';

export class MeUserResponseDto extends PickType(UserResponseDto, [
  'address',
  'name',
  'phone',
  'email',
]) {}

export const { MeUserResponse } = createResponseDtoTemp(
  MeUserResponseDto,
  'MeUser',
);
