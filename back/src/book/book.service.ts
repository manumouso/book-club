import { ForbiddenException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto';
import { removeFile } from './helper';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getBooks() {}

  async filterBooks(filterDto: any, valueDto: any) {}

  async getDetails(bookIdDto: number) {}

  async getBookCover(bookIdDto: number) {}

  async createBookCover(bookId: number, userId: number, fileDto: any) {
    try {
      const book = await this.prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

      if (!book) throw new ForbiddenException('BookId Not Found');
      if (book.coverId !== null)
        throw new ForbiddenException(
          'Cover Image Already Exists For This Book',
        );
      if (book.ownerId !== userId)
        throw new ForbiddenException(
          'Cover Creation Attempt: you must be the book owner',
        );

      const coverImage = await this.prisma.cover.create({
        data: {
          ...fileDto,
        },
      });
      if (!coverImage) throw new ForbiddenException('Cover Creation Failed');

      const updatedBook = await this.prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          coverId: coverImage.id,
        },
      });

      if (!updatedBook) throw new ForbiddenException('Book Update Failed');

      return { bookId: updatedBook.id, coverImage };
    } catch (error) {
      const imagesFolderPath = join(process.cwd(), 'images');
      const fullCoverImagePath = join(
        imagesFolderPath + '/' + fileDto.fileName,
      );

      removeFile(fullCoverImagePath);
      throw error;
    }
  }

  async updateBookCover(bookId: number, userId: number, fileDto: any) {}

  async getBookGenres() {}

  async getMyBooks(userId: number) {}

  async createBook(bookDto: CreateBookDto, userId: number) {
    try {
      const authorDto = {
        firstName: bookDto.firstName,
        lastName: bookDto.lastName,
      };
      const author = await this.prisma.author.create({
        data: {
          ...authorDto,
        },
      });
      if (!author) throw new ForbiddenException('Author Creation Failed');
      const book = await this.prisma.book.create({
        data: {
          isbn: bookDto.isbn,
          title: bookDto.title,
          year: bookDto.year,
          publisher: bookDto.publisher,
          synopsis: bookDto.synopsis,
          authorId: author.id,
          genreId: bookDto.genreId,
          ownerId: userId,
        },
      });
      if (!book) throw new ForbiddenException('Book Creation Failed');
      return { bookId: book.id };
    } catch (error) {
      throw error;
    }
  }

  async patchBook(bookOptionalDto: any, bookIdDto: number, userId: number) {}

  async deleteBook(bookIdDto: any, userId: number) {}
}
