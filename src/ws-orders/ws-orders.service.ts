import { UsersService } from '@/users/users.service';
import { JwtService } from '@jwt/jwt.service';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsOrdersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  checkAdmin(client: Socket) {
    const token = client.handshake.query.token as string;
    if (!token) {
      return false;
    }
    try {
      this.jwtService.verifyToken(token);
    } catch {
      return false;
    }

    // try {
    //   const { role, id } = this.jwtService.verifyToken(token);
    //   if (role !== 'ADMIN') {
    //     return false;
    //   }
    //   const user = await this.usersService.findById(id);
    //   if (user.role !== 'ADMIN') {
    //     return false;
    //   }
    // } catch {
    //   return false;
    // }
    return true;
  }
}
