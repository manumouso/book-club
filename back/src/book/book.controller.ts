import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { GetUser, Public } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookService } from './book.service';
import { CreateBookDto, EditBookDto } from './dto';
import { removeFile, saveCoverImage } from './helper';
import { FileValidator } from './pipe';

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Public()
  @Get('')
  getBooks() {
    return this.bookService.getBooks();
  }

  /*devuelve los libros filtrados por la condicion y valor seleccionados por el usuario
  desde el front puede ser un desplegable con las opciones para filtrar(year, title,author etc)
  y un input para que ingrese el valar que quiere (1991 o 'el principito' etc)
  armar dos dto uno para cada query param

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

  @Public()
  @Get('covers/:bookId')
  getBookCover(@Param('bookId', ParseIntPipe) bookId: number, @Res() res) {
    const filename = this.bookService.getBookCover(bookId);
    return res.sendFile(filename, {
      root: './images',
    });
  }
  @UseInterceptors(FileInterceptor('file', saveCoverImage))
  @Post('covers/:bookId')
  createBookCover(
    @Param('bookId') bookId: any,
    @GetUser('id') userId: number,
    @UploadedFile(FileValidator)
    file: Express.Multer.File,
  ) {
    try {
      const bookIdToInt = parseInt(bookId);
      if (isNaN(bookIdToInt))
        throw new ForbiddenException('Book Id Must be a Number');

      const fileDto = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileName: file.filename,
      };
      return this.bookService.createBookCover(bookIdToInt, userId, fileDto);
    } catch (error) {
      const imagesFolderPath = join(process.cwd(), 'images');
      const fullCoverImagePath = join(imagesFolderPath + '/' + file.filename);

      removeFile(fullCoverImagePath);

      return { error };
    }
  }

  //guardar extraer el filename viejo eliminar la imagen de images y guardar el nuevo filename
  @UseInterceptors(FileInterceptor('file', saveCoverImage))
  @Patch('covers/:bookId')
  updateBookCover(
    @Param('bookId') bookId: any,
    @GetUser('id') userId: number,
    @UploadedFile(FileValidator)
    file: Express.Multer.File,
  ) {
    try {
      const bookIdToInt = parseInt(bookId);
      if (isNaN(bookIdToInt))
        throw new ForbiddenException('Book Id Must be a Number');

      const fileDto = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileName: file.filename,
      };
      return this.bookService.updateBookCover(bookIdToInt, userId, fileDto);
    } catch (error) {
      const imagesFolderPath = join(process.cwd(), 'images');
      const fullCoverImagePath = join(imagesFolderPath + '/' + file.filename);

      removeFile(fullCoverImagePath);

      return { error };
    }
  }

  @Public()
  @Get('genres')
  getBookGenres() {}
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
  deleteBook(@Param('bookId') bookIdDto: any, @GetUser('id') userId: number) {
    return this.bookService.deleteBook(bookIdDto, userId);
  }
}
