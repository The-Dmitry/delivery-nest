import { MeUpdateDto } from '@/me/dto/me-update.dto';
import { UserResponseDto } from '@/users/dto/response/users-response.dto';
import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { verify } from 'argon2';

@Injectable()
export class MeService {
  constructor(private readonly usersService: UsersService) {}

  async getMe(id: string): Promise<UserResponseDto> {
    return await this.usersService.findById(id);
  }

  async updateMe(id: string, { password, newPassword, ...rest }: MeUpdateDto) {
    if (password && newPassword) {
      const currentUser = await this.usersService.findById(id);
      const isOldPasswordValid = await verify(currentUser.password, password);
      if (!isOldPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
      return await this.usersService.update(id, {
        ...rest,
        password: newPassword,
      });
    }

    return await this.usersService.update(id, rest);
  }
}
