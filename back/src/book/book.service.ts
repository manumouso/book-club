import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getBooks() {}

  async filterBooks(filterDto: any, valueDto: any) {}

  async getDetails(bookIdDto: number) {}

  async getMyBooks(userId: number) {}

  async createBook(
    bookDto: any,
    userId: number,
    originalname: string,
    mimetype: string,
    buffer: Buffer,
  ) {}

  async updateBook(bookDto: any, bookIdDto: number, userId: number) {}

  async patchBook(bookOptionalDto: any, bookIdDto: number, userId: number) {}

  async deleteBook(bookIdDto: any, userId: number) {}
}
