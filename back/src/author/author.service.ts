import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async getAuthors() {}

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
}
