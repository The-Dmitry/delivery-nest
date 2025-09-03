import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeService {
  constructor(private readonly usersService: UsersService) {}

  async getMe(id: string): Promise<UserResponseDto> {
    return await this.usersService.findById(id);
  }
}
