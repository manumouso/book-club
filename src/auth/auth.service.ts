import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(authDto: AuthDto) {
    const hash = await argon.hash(authDto.password);

    const user = await this.prisma.user.create({
      data: {
        email: authDto.email,
        hash,
      },
    });

    delete user.hash;

    return user;
  }
  signin(authDto: AuthDto) {
    return { message: authDto };
  }
}
