import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { removeFile } from './helper';
import { BookService } from 'src/book/book.service';

@Injectable()
export class CoverService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => BookService))
    private bookService: BookService,
  ) {}
  async getBookCover(bookId: number) {}

  async createBookCover(bookId: number, userId: number, fileDto: any) {
    try {
      const book = await this.bookService.findBook(bookId);
      if (book.coverId !== null)
        throw new ForbiddenException(
          'Cover Image Already Exists For This Book',
        );
      this.bookService.checkOwnership(book.ownerId, userId, 'Cover Creation');

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

  async deleteBookCover(coverId: number) {
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

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullCoverImagePath = join(imagesFolderPath + '/' + cover.fileName);

    removeFile(fullCoverImagePath);
  }
}
