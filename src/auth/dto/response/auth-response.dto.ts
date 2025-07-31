import { JwtData } from '@jwt/models/models';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto implements JwtData {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user is anonymous',
  })
  anonymous: boolean;

  @ApiProperty({
    example: '2023-10-01T12:00:00.000Z',
    description: 'Expiration date of the access token',
  })
  accessTokenExpiresAt: string;
}
