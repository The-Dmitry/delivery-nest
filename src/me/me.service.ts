import { MeChangePasswordDto } from '@/me/dto/me-change-password.dto';
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

  async updateMe(id: string, data: MeUpdateDto) {
    return await this.usersService.update(id, data);
  }

  async changePassword(
    id: string,
    { password, newPassword }: MeChangePasswordDto,
  ) {
    if (!(password && newPassword)) {
      throw new BadRequestException('Password and new password are required');
    }
    const currentUser = await this.usersService.findById(id);
    const isOldPasswordValid = await verify(currentUser.password, password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    await this.usersService.update(id, {
      password: newPassword,
    });
    return {
      message: 'Password changed successfully',
      passwordChanged: true,
    };
  }
}
