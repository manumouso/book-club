import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(bookId: number, userId: number) {}

  async returnBook(bookId: number, userId: number) {}
}
