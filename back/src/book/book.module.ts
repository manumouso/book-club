import { forwardRef, Module } from '@nestjs/common';
import { AuthorModule } from 'src/author/author.module';
import { CoverModule } from 'src/cover/cover.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [AuthorModule, forwardRef(() => CoverModule)],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
