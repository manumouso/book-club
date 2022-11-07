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

  async filterBooks(filterDto: any, valueDto: any) {}

  async getDetails(bookId: number) {}

  async getMyBooks(userId: number) {}

  async createBook(bookDto: CreateBookDto, userId: number) {
    try {
      const authorDto = {
        firstName: bookDto.firstName,
        lastName: bookDto.lastName,
      };
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
