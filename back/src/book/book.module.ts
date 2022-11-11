import { forwardRef, Module } from '@nestjs/common';
import { AuthorService } from 'src/author/author.service';
import { CoverModule } from 'src/cover/cover.module';
import { GenreService } from 'src/genre/genre.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [forwardRef(() => CoverModule)],
  controllers: [BookController],
  providers: [BookService, AuthorService, GenreService],
  exports: [BookService],
})
export class BookModule {}
