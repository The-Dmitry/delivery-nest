import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { SerializeResponse } from '@/common/decorators/serialize-response.decorator';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
@SerializeResponse(UserResponseDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('id') id: string,
  ): Promise<UserResponseDto[]> {
    return this.usersService.findMany({ email, phone, id });
  }

  @Get('find')
  async findWithParams(
    @Query('email') email: string,
    @Query('phone') phone: string,
    @Query('id') id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findWithParams({ email, phone, id });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
