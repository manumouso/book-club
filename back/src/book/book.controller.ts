import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser, Public } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookService } from './book.service';
import { CreateBookDto, EditBookDto } from './dto';
import { validateId } from './helper';

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Public()
  @Get('')
  getBooks() {
    return this.bookService.getBooks();
  }

  /*
  url: /filterBy?filter=xxx&value=x9x
   */
  @Get('filterBy')
  filterBooks(@Query('filter') filterDto: any, @Query('value') valueDto: any) {
    return this.bookService.filterBooks(filterDto, valueDto);
  }

  /* devuelve los detalles extra que especifica el tp sobre el libro */
  @Get('details/:bookId')
  getDetails(@Param('bookId', ParseIntPipe) bookId: number) {
    validateId(bookId);
    return this.bookService.getDetails(bookId);
  }

  @Get('me')
  getMyBooks(@GetUser('id') userId: number) {
    return this.bookService.getMyBooks(userId);
  }

  @Post('me')
  createBook(@Body() bookDto: CreateBookDto, @GetUser('id') userId: number) {
    return this.bookService.createBook(bookDto, userId);
  }

  @Patch('me/:bookId')
  patchBook(
    @Body() bookDto: EditBookDto,
    @Param('bookId', ParseIntPipe) bookId: number,
    @GetUser('id') userId: number,
  ) {
    validateId(bookId);
    return this.bookService.patchBook(bookDto, bookId, userId);
  }

  @Delete('me/:bookId')
  deleteBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @GetUser('id') userId: number,
  ) {
    validateId(bookId);
    return this.bookService.deleteBook(bookId, userId);
  }
}
