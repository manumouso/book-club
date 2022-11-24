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
import { CreateBookDto, EditBookDto, FilterBookDto, PaginateDto } from './dto';

import {
  availableBooks,
  booksBorrowedFromMe,
  getAllBooks,
  myBorrows,
  validateId,
} from './helper';

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Public()
  @Get('')
  getBooks() {
    return this.bookService.getBooks();
  }
  @Public()
  @Get('amount')
  getBooksAmounts() {
    return this.bookService.getBooksAmount();
  }
  @Public()
  @Get('paginate')
  async getBooksPaginate(@Query() paginate: PaginateDto) {
    const bookAmount = await this.bookService.getBooksAmount();
    const booksSearch = getAllBooks();

    return this.bookService.getBooksPaginate(
      booksSearch,
      bookAmount.amount,
      paginate.take,
      paginate.cursor,
      paginate.booksLeftToTake,
    );
  }
  @Public()
  @Get('filterBy')
  filterBooks(@Query() filterDto: FilterBookDto) {
    return this.bookService.filterBooks(filterDto);
  }

  @Public()
  @Get('details/:bookId')
  getDetails(@Param('bookId', ParseIntPipe) bookId: number) {
    validateId(bookId);
    return this.bookService.getDetails(bookId);
  }

  @Get('me')
  getMyBooks(@GetUser('id') userId: number) {
    return this.bookService.getMyBooks(userId);
  }

  @Get('me/amounts')
  getMyBooksAmounts(@GetUser('id') userId: number) {
    return this.bookService.getMyBooksAmounts(userId);
  }

  @Get('me/paginate/available')
  async getMyAvailableBooksPaginate(
    @GetUser('id') userId: number,
    @Query() paginate: PaginateDto,
  ) {
    const getAmounts = await this.bookService.getMyBooksAmounts(userId);

    const bookType = availableBooks(userId);
    const amount = getAmounts.amounts.availableBooks;
    return this.bookService.getBooksPaginate(
      bookType,
      amount,
      paginate.take,
      paginate.cursor,
      paginate.booksLeftToTake,
    );
  }
  @Get('me/paginate/borrowedFromMe')
  async getBooksBorrowedFromMePaginate(
    @GetUser('id') userId: number,
    @Query() paginate: PaginateDto,
  ) {
    const getAmounts = await this.bookService.getMyBooksAmounts(userId);

    const bookType = booksBorrowedFromMe(userId);
    const amount = getAmounts.amounts.booksBorrowedFromMe;
    return this.bookService.getBooksPaginate(
      bookType,
      amount,
      paginate.take,
      paginate.cursor,
      paginate.booksLeftToTake,
    );
  }
  @Get('me/paginate/myBorrows')
  async getMyBorrowsPaginate(
    @GetUser('id') userId: number,
    @Query() paginate: PaginateDto,
  ) {
    const getAmounts = await this.bookService.getMyBooksAmounts(userId);

    const bookType = myBorrows(userId);
    const amount = getAmounts.amounts.myBorrows;
    return this.bookService.getBooksPaginate(
      bookType,
      amount,
      paginate.take,
      paginate.cursor,
      paginate.booksLeftToTake,
    );
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
