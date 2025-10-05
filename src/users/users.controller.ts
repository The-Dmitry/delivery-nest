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
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserResponse,
  UserResponseDto,
  UserArrayResponse,
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
import { AllUsersQueriesDto } from '@/users/dto/all-users-queries.dto';
import { TokenPayload } from '@/common/decorators/token-payload.decorator';
import { DeleteResponseDto } from '@/common/dto/delete-response.dto';
import { WithPagination } from '@/common/types/pagination';
import { SingleUserQueriesDto } from '@/users/dto/single-user-queries.dto';
import { JwtPayload } from '@jwt/models/models';
import { CreateUserDto, CreateUserResponse } from '@/users/dto/create-user.dto';

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
    summary: 'Create user (admin only)',
    description: 'Creates a new user (for dashboard use only)',
  })
  @ApiOkResponse({
    description: 'User created successfully',
    type: CreateUserResponse,
  })
  @SerializeResponse(UserResponseDto)
  @JwtAuthorization('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @ApiOperation({
    summary: 'Get array of users (admin only)',
    description: 'Retrieves a list of all users',
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: UserArrayResponse,
  })
  @JwtAuthorization()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() queries: AllUsersQueriesDto,
  ): Promise<WithPagination<UserResponseDto>> {
    return this.usersService.findMany(queries);
  }

  @ApiOperation({
    summary: 'Get user by ID (admin only)',
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
  async findById(
    @Param('id') id: string,
    @Query() queries: SingleUserQueriesDto,
  ): Promise<UserResponseDto> {
    console.log();

    return this.usersService.findById(id, queries);
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
    @TokenPayload() payload: JwtPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto, payload);
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
    @TokenPayload() admin: JwtPayload,
  ): Promise<DeleteResponseDto> {
    return await this.usersService.delete(id, admin);
  }
}
