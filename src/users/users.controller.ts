import {
  Controller,
  Get,
  Body,
  Param,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserArrayResponse,
  UserResponse,
  UserResponseDto,
} from '@/users/dto/response/users-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';
import { JwtAuthorization } from '@/common/decorators/jwt-authorization.decorator';
import { UsersQueriesDto } from '@/users/dto/users-queries.dto';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';

@ApiBadRequestResponse({
  description: 'Bad Request',
  type: ErrorResponseDto,
})
@SerializeResponse(UserResponseDto)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get array of users',
    description: 'Retrieves a list of all users',
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: UserArrayResponse,
  })
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() queries: UsersQueriesDto): Promise<UserResponseDto[]> {
    return this.usersService.findMany(queries);
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a user by their unique ID',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @ApiOperation({
    summary: 'Update user by ID (admin only)',
    description: 'Updates user details based on their unique ID',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPayload('id') adminId: string,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto, adminId);
  }

  @ApiOperation({
    summary: 'Delete user by ID (admin only)',
  })
  @ApiOkResponse({
    description: 'User deleted successfully',
    type: DeleteResponseDto,
  })
  @JwtAuthorization('ADMIN')
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @TokenPayload('id') adminId: string,
  ): Promise<DeleteResponseDto> {
    return await this.usersService.delete(id, adminId);
  }
}
