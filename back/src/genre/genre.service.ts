import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  async getGenres() {
    const genres = await this.prisma.genre.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    if (!genres) throw new UnprocessableEntityException('Cannot Get Genres');
    return { genres };
  }

  async findGenre(genreId: number) {
    const genre = await this.prisma.genre.findUnique({
      where: {
        id: genreId,
      },
    });
    if (!genre) throw new ForbiddenException('Genre Id Not Found');

    return genre;
  }
  async filterString(value: string) {
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

    return genresIds;
  }
}
