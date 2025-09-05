import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { MeService } from './me.service';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  MeUserResponse,
  MeUserResponseDto,
} from '@/me/dto/response/me-user-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { MeUpdateDto } from '@/me/dto/me-update.dto';
import { MeChangePasswordDto } from '@/me/dto/me-change-password.dto';
import {
  ChangePasswordResponse,
  ChangePasswordResponseDto,
} from '@/me/dto/response/change-password-response.dto';

@JwtAuthorization('USER')
@ApiBearerAuth('access-token')
@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @ApiOperation({
    summary: 'Get own user information',
  })
  @ApiOkResponse({ type: MeUserResponse })
  @SerializeResponse(MeUserResponseDto)
  @HttpCode(HttpStatus.OK)
  @Get()
  async meProfile(@TokenPayload('id') id: string): Promise<MeUserResponseDto> {
    return this.meService.getMe(id);
  }

  @ApiOperation({
    summary: 'Update own user information',
  })
  @ApiOkResponse({ type: MeUserResponse })
  @SerializeResponse(MeUserResponseDto)
  @HttpCode(HttpStatus.OK)
  @Patch()
  async updateMe(
    @TokenPayload('id') id: string,
    @Body() data: MeUpdateDto,
  ): Promise<MeUserResponseDto> {
    return await this.meService.updateMe(id, data);
  }

  @ApiOperation({
    summary: 'Change own user password',
  })
  @ApiOkResponse({ type: ChangePasswordResponse })
  @SerializeResponse(ChangePasswordResponseDto)
  @HttpCode(HttpStatus.OK)
  @Patch('password')
  async changePassword(
    @TokenPayload('id') id: string,
    @Body() data: MeChangePasswordDto,
  ): Promise<ChangePasswordResponseDto> {
    return await this.meService.changePassword(id, data);
  }

  async meOrders() {}
}
