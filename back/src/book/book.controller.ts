import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards,} from '@nestjs/common';
import { GetUser, Public } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookService } from './book.service';
import { CreateBookDto, EditBookDto } from './dto';

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
    return this.bookService.getDetails(bookId);
  }

  /* devuelve un objeto que tiene un objeto con los libros que el usuario obtuvo del prestamo
  y otro objeto con los libros que le pertenecen
   myBooks: {borrowed:{},owned:{}}
  */
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
    return this.bookService.patchBook(bookDto, bookId, userId);
  }

  /* antes de eliminar el libro fijarse que sea el dueño y que no este prestado */
  @Delete('me/:bookId')
  deleteBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @GetUser('id') userId: number,
  ) {
    return this.bookService.deleteBook(bookId, userId);
  }
}
