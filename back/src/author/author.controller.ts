import { Controller, Get, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { AuthorService } from './author.service';

@UseGuards(JwtGuard)
@Controller('authors')
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Public()
  @Get('')
  getAuthors() {
    return this.authorService.getAuthors();
  }
}
