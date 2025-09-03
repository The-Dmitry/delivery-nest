import { Controller, Get } from '@nestjs/common';
import { MeService } from './me.service';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  MeUserResponse,
  MeUserResponseDto,
} from '@/me/dto/me-user-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { UserResponseDto } from '@/users/dto/response/users-response.dto';

@JwtAuthorization('USER')
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @ApiOperation({
    summary: 'Get own user information',
  })
  @ApiOkResponse({ type: MeUserResponseDto })
  @SerializeResponse(MeUserResponse)
  @Get()
  async getMe(@TokenPayload('id') id: string): Promise<UserResponseDto> {
    return this.meService.getMe(id);
  }
}
