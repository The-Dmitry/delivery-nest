import { ApiProperty } from '@nestjs/swagger';
import { createResponseDtoTemp } from '@utils/createResponseDto';
import { Expose } from 'class-transformer';

export class ChangePasswordResponseDto {
  @ApiProperty({
    example: 'Password changed successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    example: true,
    description: 'Password changed successfully',
    name: 'password_changed',
  })
  @Expose({ name: 'password_changed', toPlainOnly: true })
  passwordChanged: boolean;
}

export const { ChangePasswordResponse } = createResponseDtoTemp(
  ChangePasswordResponseDto,
  'ChangePassword',
);
