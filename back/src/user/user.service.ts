import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookService } from 'src/book/book.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaxBorrow } from './enum';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private bookService: BookService,
  ) {}

  async borrowBook(bookId: number, userId: number) {
    const book = await this.bookService.findBook(bookId);

    if (book.holderId)
      throw new ForbiddenException('This Book Has Already Been Borrowed');

    const getAmounts = await this.bookService.getMyBooksAmounts(userId);
    if (getAmounts.amounts.myBorrows >= MaxBorrow.MAX_BORROWS)
      throw new ForbiddenException(
        'You Reached The Limit Of Allowed Loans: ' + MaxBorrow.MAX_BORROWS,
      );
    const now = new Date();

    const updatedBook = await this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        holderId: userId,
        withdrawnAt: now,
      },
    });
    if (!updatedBook) throw new ForbiddenException('Book Borrow Failed');

    return { borrowedBookId: updatedBook.id };
  }

  async returnBook(bookId: number, userId: number) {
    const book = await this.bookService.findBook(bookId);
    if (!book.holderId)
      throw new ForbiddenException(
        'You Cannot Return A Book That Was Not Borrowed',
      );

    if (book.holderId !== userId)
      throw new ForbiddenException('You Cannot Return A Book You Do Not Have');

    const updatedBook = await this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        holderId: null,
        withdrawnAt: null,
      },
    });
    if (!updatedBook) throw new ForbiddenException('Book Return Failed');

    return { returnedBookId: updatedBook.id };
  }
}
