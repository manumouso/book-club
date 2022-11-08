import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getPath, removeFile } from './helper';
import { BookService } from 'src/book/book.service';

@Injectable()
export class CoverService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => BookService))
    private bookService: BookService,
  ) {}
  async getBookCover(bookId: number) {
    const book = await this.bookService.findBook(bookId);
    if (!book.coverId)
      throw new ForbiddenException('There Is No Cover Image For This Book');

    const coverImage = await this.prisma.cover.findUnique({
      where: {
        id: book.coverId,
      },
    });
    if (!coverImage) throw new ForbiddenException('Cover Image Not Found');

    return coverImage.fileName;
  }

  async createBookCover(bookId: number, userId: number, fileDto: any) {
    try {
      const book = await this.bookService.findBook(bookId);

      this.bookService.checkOwnership(book.ownerId, userId, 'Cover Creation');

      if (book.coverId !== null)
        throw new ForbiddenException(
          'Cover Image Already Exists For This Book',
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
      const coverPath = getPath(fileDto.fileName);
      removeFile(coverPath);

      throw error;
    }
  }

  async updateBookCover(bookId: number, userId: number, fileDto: any) {
    try {
      const book = await this.bookService.findBook(bookId);
      this.bookService.checkOwnership(book.ownerId, userId, 'Cover Update');
      if (!book.coverId)
        throw new ForbiddenException('There Is No Cover Image For This Book');

      const previousCoverImage = await this.prisma.cover.findUnique({
        where: {
          id: book.coverId,
        },
      });
      if (!previousCoverImage)
        throw new ForbiddenException('Cover Image To Update Not Found');
      const previousCoverPath = getPath(previousCoverImage.fileName);
      removeFile(previousCoverPath);

      const updatedCoverImage = await this.prisma.cover.update({
        where: {
          id: book.coverId,
        },
        data: {
          ...fileDto,
        },
      });
      if (!updatedCoverImage)
        throw new ForbiddenException('Cover Update Failed');

      return { bookId: book.id, updatedCoverImage };
    } catch (error) {
      const coverPath = getPath(fileDto.fileName);
      removeFile(coverPath);

      throw error;
    }
  }

  async deleteBookCover(coverId?: number) {
    if (!coverId) return;
    const findCover = await this.prisma.cover.findUnique({
      where: {
        id: coverId,
      },
    });
    if (!findCover) return;
    const cover = await this.prisma.cover.delete({
      where: {
        id: coverId,
      },
    });
    if (!cover) throw new ForbiddenException('Book Cover Delete Failed');

    const coverPath = getPath(cover.fileName);
    removeFile(coverPath);
  }
}
