import { ApiProperty } from '@nestjs/swagger';
import { createResponseDto } from '@utils/createResponseDto';
import { Expose } from 'class-transformer';
import { $Enums } from 'generated/prisma';

export class AuthResponseDto {
  @ApiProperty({
    name: 'access_token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token',
  })
  @Expose({ name: 'access_token', toPlainOnly: true })
  accessToken: string;

  @ApiProperty({
    name: 'refresh_token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token',
  })
  @Expose({ name: 'refresh_token', toPlainOnly: true })
  refreshToken: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user is anonymous',
  })
  anonymous: boolean;

  @ApiProperty({
    example: 'USER',
    description: 'Role of the user',
    enum: $Enums.Role,
  })
  role: $Enums.Role;

  @ApiProperty({
    name: 'access_token_expires_at',
    example: '2023-10-01T12:00:00.000Z',
    description: 'Expiration date of the access token',
  })
  @Expose({ name: 'access_token_expires_at', toPlainOnly: true })
  accessTokenExpiresAt: string;
}

export const { AuthResponse } = createResponseDto(AuthResponseDto, 'Auth');
