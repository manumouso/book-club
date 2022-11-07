import { Controller, Get, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { GenreService } from './genre.service';

@UseGuards(JwtGuard)
@Controller('genres')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Public()
  @Get('')
  getGenres() {}
}
