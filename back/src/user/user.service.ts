import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(bookIdDto: any, userId: number) {}

  async returnBook(bookIdDto: any, userId: number) {}
}
