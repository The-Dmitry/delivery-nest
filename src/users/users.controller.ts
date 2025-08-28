import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UserArrayResponse,
  UserResponse,
  UserResponseDto,
} from '@/users/dto/response/users-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '@/common/dto/error-response.dto';

@SerializeResponse(UserResponseDto)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: ErrorResponseDto,
})
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description: 'Registers a new user with the provided details',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users',
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: UserArrayResponse,
  })
  @ApiQuery({
    name: 'email',
    required: false,
  })
  @ApiQuery({
    name: 'phone',
    required: false,
  })
  @ApiQuery({
    name: 'id',
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('id') id: string,
  ): Promise<UserResponseDto[]> {
    return this.usersService.findMany({ email, phone, id });
  }

  @ApiOperation({
    summary: 'Find user by parameters',
    description:
      'Retrieves a user based on provided query parameters (email, phone, id)',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponse,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiQuery({
    name: 'email',
    required: false,
  })
  @ApiQuery({
    name: 'phone',
    required: false,
  })
  @ApiQuery({
    name: 'id',
    required: false,
  })
  @HttpCode(HttpStatus.OK)
  @Get('find')
  async findWithParams(
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('id') id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findWithParams({ email, phone, id });
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
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @ApiOperation({
    summary: 'Update user by ID',
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
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }
}
