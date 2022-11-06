import { ForbiddenException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, EditBookDto } from './dto';
import { removeFile } from './helper';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

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

  async getBookCover(bookId: number) {}

  async createBookCover(bookId: number, userId: number, fileDto: any) {
    try {
      const book = await this.findBook(bookId);
      if (book.coverId !== null)
        throw new ForbiddenException(
          'Cover Image Already Exists For This Book',
        );
      this.checkOwnership(book.ownerId, userId, 'Cover Creation');

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

  async getAuthors() {}
  async getGenres() {}

  async getMyBooks(userId: number) {}

  async createOrFindAuthor(authorDto: any, authorId?: number) {
    if (!authorId) {
      const author = await this.prisma.author.create({
        data: {
          ...authorDto,
        },
      });
      if (!author) throw new ForbiddenException('Author Creation Failed');

      return author.id;
    }
    const author = await this.prisma.author.findUnique({
      where: {
        id: authorId,
      },
    });
    if (!author) throw new ForbiddenException('Author Id Not Found');

    return author.id;
  }
  async createBook(bookDto: CreateBookDto, userId: number) {
    try {
      const authorDto = {
        firstName: bookDto.firstName,
        lastName: bookDto.lastName,
      };
      const idAuthor: number = await this.createOrFindAuthor(
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

  async updateAuthorIfPossible(
    previousAuthorId: number,
    idAuthor: number,
    authorDto: any,
  ) {
    const findAuthorsInBooks = await this.prisma.book.findMany({
      where: {
        authorId: previousAuthorId,
      },
    });
    if (findAuthorsInBooks.length === 1) {
      const updateAuthor = await this.prisma.author.update({
        where: {
          id: idAuthor,
        },
        data: {
          ...authorDto,
        },
      });
      if (!updateAuthor) throw new ForbiddenException('Author Updated Failed');
    }
  }

  async deleteAuthorIfPossible(idToDelete: number) {
    const findAuthorsInBooks = await this.prisma.book.findMany({
      where: {
        authorId: idToDelete,
      },
    });
    if (findAuthorsInBooks.length === 0) {
      const deleteAuthor = await this.prisma.author.delete({
        where: {
          id: idToDelete,
        },
      });
      if (!deleteAuthor)
        throw new ForbiddenException('Previous Author Delete Failed');
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
      const idAuthor: number = await this.createOrFindAuthor(
        authorDto,
        bookDto.authorId,
      );

      await this.updateAuthorIfPossible(previousAuthorId, idAuthor, authorDto);

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

      await this.deleteAuthorIfPossible(previousAuthorId);

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
      await this.deleteAuthorIfPossible(book.authorId);
      return { bookDeleted: deletedBook };
    } catch (error) {
      throw error;
    }
  }
}
