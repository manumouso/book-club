import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthorService } from 'src/author/author.service';
import { CoverService } from 'src/cover/cover.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, EditBookDto } from './dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { availableBooks, booksBorrowedFromMe, myBorrows } from './helper';

@Injectable()
export class BookService {
  constructor(
    private prisma: PrismaService,
    private authorService: AuthorService,
    @Inject(forwardRef(() => CoverService))
    private coverService: CoverService,
  ) {}

  async findBook(bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) throw new ForbiddenException('BookId Not Found');

    return book;
  }

  checkOwnership(ownerId: number, userId: number, errorMessage: string) {
    if (ownerId !== userId)
      throw new ForbiddenException(
        errorMessage + ' Attempt: You Must Be The Book Owner',
      );
  }
  async getBooks() {}

  async filterIntBookTable(filter: string, value: any) {
    const valueToInt = parseInt(value);
    if (isNaN(valueToInt))
      throw new ForbiddenException(
        'You Must Enter A Number When Filtering By: ' + filter,
      );
    const books = await this.prisma.book.findMany({
      where: {
        [filter]: valueToInt,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }

  async filterStringBookTable(filter: string, value: string) {
    const books = await this.prisma.book.findMany({
      where: {
        [filter]: {
          contains: value,
          mode: 'insensitive',
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }

  async filterStringGenreTable(value: string) {
    const genresIds = await this.prisma.genre.findMany({
      where: {
        name: {
          contains: value,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const idsArr = genresIds.map((genresIds) => genresIds.id);

    const books = await this.prisma.book.findMany({
      where: {
        genreId: {
          in: idsArr,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }
  async filterStringAuthorTable(filter: string, value: string) {
    const authorsIds = await this.prisma.author.findMany({
      where: {
        [filter]: {
          contains: value,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const idsArr = authorsIds.map((authorsId) => authorsId.id);

    const books = await this.prisma.book.findMany({
      where: {
        authorId: {
          in: idsArr,
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }
  async filterBooks(filterDto: FilterBookDto) {
    try {
      switch (filterDto.filter) {
        case 'isbn':
        case 'title':
        case 'publisher':
          return await this.filterStringBookTable(
            filterDto.filter,
            filterDto.value,
          );
        case 'year':
          return await this.filterIntBookTable(
            filterDto.filter,
            filterDto.value,
          );
        case 'genre':
          return await this.filterStringGenreTable(filterDto.value);
        case 'firstName':
        case 'lastName':
          return await this.filterStringAuthorTable(
            filterDto.filter,
            filterDto.value,
          );
        default:
          break;
      }
    } catch (error) {
      throw error;
    }
  }

  async getDetails(bookId: number) {}

  async validateCursor(cursor: number) {
    const findCursor = await this.prisma.book.findUnique({
      where: {
        id: cursor,
      },
    });

    if (!findCursor) throw new ForbiddenException('Cursor Not Found');
  }

  validateTake(take: number, bookAmount: number, booksLeftToTake?: number) {
    if (take > bookAmount)
      throw new ForbiddenException('Take Is Bigger Than The Number Of Books');
    if (isNaN(booksLeftToTake))
      throw new ForbiddenException(
        'Books Left To Take Required As Query Param',
      );
    if (booksLeftToTake < 0)
      throw new ForbiddenException('Take Is Bigger Than Books Left To Take');
  }
  async getMyBooksPaginate(
    bookType: any,
    bookAmount: number,
    take: number,
    cursor?: number,
    booksLeftToTake?: number,
  ) {
    try {
      if (!cursor) {
        const booksLeft = bookAmount - take;
        this.validateTake(take, bookAmount, booksLeft);
        const firstQueryResults = await this.prisma.book.findMany({
          take: take,
          ...bookType,
          orderBy: {
            id: 'asc',
          },
        });

        const lastBookInResults = firstQueryResults[take - 1];
        const myCursor = lastBookInResults.id;

        return {
          books: firstQueryResults,
          take,
          cursor: myCursor,
          booksLeftToTake: booksLeft,
        };
      } else {
        await this.validateCursor(cursor);
        const booksLeft = booksLeftToTake - take;
        this.validateTake(take, bookAmount, booksLeft);
        const secondQueryResults = await this.prisma.book.findMany({
          take: take,
          skip: 1,
          cursor: {
            id: cursor,
          },
          ...bookType,
          orderBy: {
            id: 'asc',
          },
        });

        const lastBookInResults = secondQueryResults[take - 1];
        const myCursor = lastBookInResults.id;

        return {
          books: secondQueryResults,
          take,
          cursor: myCursor,
          booksLeftToTake: booksLeft,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getMyBooksAmounts(userId: number) {
    try {
      const booksBorrowedFromMe = await this.prisma.book.count({
        where: {
          ownerId: userId,
          holderId: {
            not: null,
          },
        },
      });
      const availableBooks = await this.prisma.book.count({
        where: {
          ownerId: userId,
          holderId: null,
        },
      });

      const myBorrows = await this.prisma.book.count({
        where: {
          holderId: userId,
        },
      });

      const amounts = { booksBorrowedFromMe, availableBooks, myBorrows };

      return { amounts };
    } catch (error) {
      throw error;
    }
  }
  async getMyBooks(userId: number) {
    const booksBorrowed = booksBorrowedFromMe(userId);
    const available = availableBooks(userId);
    const myBorrow = myBorrows(userId);
    try {
      const booksBorrowedFromMe = await this.prisma.book.findMany({
        ...booksBorrowed,
        orderBy: {
          id: 'asc',
        },
      });

      const availableBooks = await this.prisma.book.findMany({
        ...available,
        orderBy: {
          id: 'asc',
        },
      });

      const myBorrows = await this.prisma.book.findMany({
        ...myBorrow,
        orderBy: {
          id: 'asc',
        },
      });

      return { myBooks: { booksBorrowedFromMe, availableBooks }, myBorrows };
    } catch (error) {
      throw error;
    }
  }

  async createBook(bookDto: CreateBookDto, userId: number) {
    try {
      const authorDto = {
        firstName: bookDto.firstName,
        lastName: bookDto.lastName,
      };
      const genre = await this.prisma.genre.findUnique({
        where: {
          id: bookDto.genreId,
        },
      });
      if (!genre) throw new ForbiddenException('Genre Id Not Found');
      const idAuthor: number = await this.authorService.createOrFindAuthor(
        authorDto,
        bookDto.authorId,
      );

      const book = await this.prisma.book.create({
        data: {
          isbn: bookDto.isbn,
          title: bookDto.title,
          year: bookDto.year,
          publisher: bookDto.publisher,
          synopsis: bookDto.synopsis,
          authorId: idAuthor,
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

  async patchBook(bookDto: EditBookDto, bookId: number, userId: number) {
    try {
      const book = await this.findBook(bookId);

      this.checkOwnership(book.ownerId, userId, 'Book Update');

      const previousAuthorId = book.authorId;
      const authorDto = {
        firstName: bookDto.firstName,
        lastName: bookDto.lastName,
      };
      const idAuthor: number = await this.authorService.createOrFindAuthor(
        authorDto,
        bookDto.authorId,
      );

      await this.authorService.updateAuthorIfPossible(
        previousAuthorId,
        idAuthor,
        authorDto,
      );

      const updatedBook = await this.prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          isbn: bookDto.isbn,
          title: bookDto.title,
          year: bookDto.year,
          publisher: bookDto.publisher,
          synopsis: bookDto.synopsis,
          genreId: bookDto.genreId,
          authorId: idAuthor,
        },
      });
      if (!updatedBook) throw new ForbiddenException('Book Update Failed');

      await this.authorService.deleteAuthorIfPossible(previousAuthorId);

      return { bookId: updatedBook.id };
    } catch (error) {
      throw error;
    }
  }

  async deleteBook(bookId: number, userId: number) {
    try {
      const book = await this.findBook(bookId);

      this.checkOwnership(book.ownerId, userId, 'Book Delete');

      if (book.holderId !== null)
        throw new ForbiddenException(
          'Book Delete Attempt: This Book Is Borrowed',
        );

      const deletedBook = await this.prisma.book.delete({
        where: {
          id: bookId,
        },
      });
      if (!deletedBook) throw new ForbiddenException('Book Delete Failed');

      await this.authorService.deleteAuthorIfPossible(book.authorId);

      await this.coverService.deleteBookCover(deletedBook.coverId);
      return { bookDeleted: deletedBook };
    } catch (error) {
      throw error;
    }
  }
}
