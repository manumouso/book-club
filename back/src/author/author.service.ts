import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async getAuthors() {
    const authors = await this.prisma.author.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    if (!authors) throw new UnprocessableEntityException('Cannot Get Authors');
    return { authors };
  }

  async filterString(filter: string, value: string) {
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

    return authorsIds;
  }

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
    idAuthor: number,
    authorDto: any,
    authorsInBooksAmount: number,
  ) {
    if (authorsInBooksAmount === 1) {
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

  async deleteAuthorIfPossible(
    authorsInBooksAmount: number,
    idToDelete: number,
  ) {
    if (authorsInBooksAmount === 0) {
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
