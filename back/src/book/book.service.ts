import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Book } from '@prisma/client';
import { AuthorService } from 'src/author/author.service';
import { CoverService } from 'src/cover/cover.service';
import { GenreService } from 'src/genre/genre.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, EditBookDto, FilterBookDto } from './dto';
import { FilterBookType } from './enum';
import {
  availableBooks,
  booksBorrowedFromMe,
  getAllBooks,
  myBorrows,
} from './helper';

@Injectable()
export class BookService {
  constructor(
    private prisma: PrismaService,
    private authorService: AuthorService,
    private genreService: GenreService,
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
  async getBooks() {
    const searchFilter = getAllBooks();
    const books = await this.prisma.book.findMany({
      ...searchFilter,
      orderBy: {
        id: 'asc',
      },
    });
    if (!books) throw new UnprocessableEntityException('Cannot Get Books');
    return { books };
  }

  async getBooksAmount() {
    const amount = await this.prisma.book.count();
    if (!amount)
      throw new UnprocessableEntityException('Cannot Get Books Amount');
    return { amount };
  }

  async filterIntBookTable(filter: string, value: any) {
    const searchFilter = getAllBooks();
    const valueToInt = parseInt(value);
    if (isNaN(valueToInt))
      throw new ForbiddenException(
        'You Must Enter A Number When Filtering By: ' + filter,
      );
    const books = await this.prisma.book.findMany({
      where: {
        [filter]: valueToInt,
      },
      ...searchFilter,
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }

  async filterStringBookTable(filter: string, value: string) {
    const searchFilter = getAllBooks();
    const books = await this.prisma.book.findMany({
      where: {
        [filter]: {
          contains: value,
          mode: 'insensitive',
        },
      },
      ...searchFilter,
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }

  async filterStringGenreTable(value: string) {
    const searchFilter = getAllBooks();
    const genresIds = await this.genreService.filterString(value);

    const idsArr = genresIds.map((genresIds) => genresIds.id);

    const books = await this.prisma.book.findMany({
      where: {
        genreId: {
          in: idsArr,
        },
      },
      ...searchFilter,
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }
  async filterStringAuthorTable(filter: string, value: string) {
    const searchFilter = getAllBooks();
    const authorsIds = await this.authorService.filterString(filter, value);

    const idsArr = authorsIds.map((authorsId) => authorsId.id);

    const books = await this.prisma.book.findMany({
      where: {
        authorId: {
          in: idsArr,
        },
      },
      ...searchFilter,
      orderBy: {
        id: 'asc',
      },
    });

    return { books };
  }
  async filterBooks(filterDto: FilterBookDto) {
    try {
      switch (filterDto.filter) {
        case FilterBookType.ISBN:
        case FilterBookType.TITLE:
        case FilterBookType.PUBLISHER:
          return await this.filterStringBookTable(
            filterDto.filter,
            filterDto.value,
          );
        case FilterBookType.YEAR:
          return await this.filterIntBookTable(
            filterDto.filter,
            filterDto.value,
          );
        case FilterBookType.GENRE:
          return await this.filterStringGenreTable(filterDto.value);
        case FilterBookType.FIRSTNAME:
        case FilterBookType.LASTNAME:
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

  async getDetails(bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
        isbn: true,
        title: true,
        year: true,
        publisher: true,
        synopsis: true,
        coverId: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        genre: {
          select: {
                id: true,
            name: true,
          },
        },
      },
    });
    if (!book) throw new ForbiddenException('Book Id Not Found');
    return { book };
  }

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

  async firstQuery(take: number, searchType: any, booksLeft: number) {
    const firstQueryResults = await this.prisma.book.findMany({
      take: take,
      ...searchType,
      orderBy: {
        id: 'asc',
      },
    });

    const lastBookInResults = firstQueryResults[take - 1];
    if (!lastBookInResults)
      throw new ForbiddenException('There Are No More Books Left To Take');
    const myCursor = lastBookInResults?.id;

    return {
      books: firstQueryResults,
      take,
      cursor: myCursor,
      booksLeftToTake: booksLeft,
    };
  }

  async secondQuery(
    take: number,
    cursor: number,
    searchType: any,
    booksLeft: number,
  ) {
    const secondQueryResults = await this.prisma.book.findMany({
      take: take,
      skip: 1,
      cursor: {
        id: cursor,
      },
      ...searchType,
      orderBy: {
        id: 'asc',
      },
    });

    const lastBookInResults = secondQueryResults[take - 1];
    if (!lastBookInResults)
      throw new ForbiddenException('There Are No More Books Left To Take');
    const myCursor = lastBookInResults?.id;

    return {
      books: secondQueryResults,
      take,
      cursor: myCursor,
      booksLeftToTake: booksLeft,
    };
  }
  async getBooksPaginate(
    searchType: any,
    bookAmount: number,
    take: number,
    cursor?: number,
    booksLeftToTake?: number,
  ) {
    try {
      if (!cursor) {
        const booksLeft = bookAmount - take;
        this.validateTake(take, bookAmount, booksLeft);

        return this.firstQuery(take, searchType, booksLeft);
      } else {
        await this.validateCursor(cursor);
        const booksLeft = booksLeftToTake - take;
        this.validateTake(take, bookAmount, booksLeft);

        return this.secondQuery(take, cursor, searchType, booksLeft);
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
      const genre = await this.genreService.findGenre(bookDto.genreId);

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
          genreId: genre.id,
          ownerId: userId,
        },
      });
      if (!book) throw new ForbiddenException('Book Creation Failed');
      return { book };
    } catch (error) {
      throw error;
    }
  }

  async patchBook(bookDto: EditBookDto, bookId: number, userId: number) {
    try {
      const book = await this.findBook(bookId);
      let updatedBook: Book;
      this.checkOwnership(book.ownerId, userId, 'Book Update');
      if (bookDto.authorId || bookDto.lastName) {
        const previousAuthorId = book.authorId;
        const authorDto = {
          firstName: bookDto.firstName,
          lastName: bookDto.lastName,
        };
        const idAuthor: number = await this.authorService.createOrFindAuthor(
          authorDto,
          bookDto.authorId,
        );

        const authorsInBooksAmount = await this.prisma.book.count({
          where: {
            authorId: previousAuthorId,
          },
        });

        await this.authorService.updateAuthorIfPossible(
          idAuthor,
          authorDto,
          authorsInBooksAmount,
        );

        updatedBook = await this.prisma.book.update({
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

        const authorsInBooksAmount2 = await this.prisma.book.count({
          where: {
            authorId: previousAuthorId,
          },
        });
        await this.authorService.deleteAuthorIfPossible(
          authorsInBooksAmount2,
          previousAuthorId,
        );
      } else {
        updatedBook = await this.prisma.book.update({
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
          },
        });
        if (!updatedBook) throw new ForbiddenException('Book Update Failed');
      }

      return { updatedBook };
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

      const authorsInBooksAmount = await this.prisma.book.count({
        where: {
          authorId: deletedBook.authorId,
        },
      });
      await this.authorService.deleteAuthorIfPossible(
        authorsInBooksAmount,
        deletedBook.authorId,
      );

      await this.coverService.deleteBookCover(deletedBook.coverId);
      return { deletedBook };
    } catch (error) {
      throw error;
    }
  }

  async updateBookCoverId(bookId: number, newCoverId: number) {
    const updatedBook = await this.prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        coverId: newCoverId,
      },
    });

    if (!updatedBook)
      throw new ForbiddenException('Book Cover Id Update Failed');

    return updatedBook;
  }

  async updateBookWhenBorrowed(bookId: number, userId: number, now: any) {
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

    return updatedBook;
  }

  async updateBookWhenReturned(bookId: number) {
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

    return updatedBook;
  }
}
