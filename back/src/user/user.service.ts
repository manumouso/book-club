import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookService } from 'src/book/book.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaxBorrow } from './enum';

@Injectable()
export class UserService {
  constructor(
    private bookService: BookService,
    private prisma: PrismaService,
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

    const updatedBook = await this.bookService.updateBookWhenBorrowed(
      bookId,
      userId,
      now,
    );

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

    const updatedBook = await this.bookService.updateBookWhenReturned(bookId);

    return { returnedBookId: updatedBook.id };
  }

  async createUser(email: string, hash: string) {
    const user = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials Incorrect');

    return user;
  }

  async findUserBySub(payloadSub: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payloadSub,
      },
    });
    if (user) delete user.hash;

    return user;
  }
}
