import {
        Body,
        Controller,
        Delete,
        Get,
        Param,
        Patch,
        Post,
        Put,
        Query,
        UploadedFile,
        UseGuards,
        UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser, Public } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookService } from './book.service';
import { FileValidator } from './pipe';
import { BookDto } from './dto';

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
        constructor(private bookService: BookService/* inyectar todos los dto*/) { }

        /*devuelve todos los libros, unica ruta Publica
        para la imagen de portada en service hacer un map,
        para cada libro que te devuelve la busqueda desde la base de datos -> .then(books=>{books.map(...)})
        convertir imageData que esta en bytea a STRING en base 64
        .toString('base64')
        porque necesitamos desde el front llenar un 
        elemento imagen de html <img src="data:image/jpeg;base64, <string en base 64 de la imagen>" /> 
        */
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
        getDetails(@Param('bookId') bookIdDto: any) {
                return this.bookService.getDetails(bookIdDto);
        }

        /* devuelve un objeto que tiene un objeto con los libros que el usuario obtuvo del prestamo
        y otro objeto con los libros que le pertenecen
         myBooks: {borrowed:{},owned:{}}
         
         para la imagen de portada en service hacer un map,
        para cada libro que te devuelve la busqueda desde la base de datos -> .then(books=>{books.map(...)})
        convertir imageData que esta en bytea a STRING en base 64
        .toString('base64')
        porque necesitamos desde el front llenar un 
        elemento imagen de html <img src="data:image/jpeg;base64, <string en base 64 de la imagen>" /> 
        */
        @Get('me')
        getMyBooks(@GetUser('id') userId: number) {
                return this.bookService.getMyBooks(userId);
        }

        /* armar el dto con todos los datos que se reciben del libro,
         la validacion de la imagen de portada(mimetype, y max size en FileValidator)
         field name desde el front en form = 'file' y multipart/form-data
         crear el libro: primero crear el registro de la imagen de portada en DB, despues el autor 
         y por ultimo el libro, (generos estan precargados)
         porque tienen que existir las PK en esas tablas para poder crear las FK en tabla libros 
         guardar el id del usuario en ownerId
         */
        @UseInterceptors(FileInterceptor('file'))
        @Post('me')
        createBook(
                @Body() bookDto: BookDto,
                @UploadedFile(FileValidator)
                file: Express.Multer.File,
                @GetUser('id') userId: number,
        ) {
                return this.bookService.createBook(
                        bookDto,
                        userId,
                        file.originalname,
                        file.mimetype,
                        file.buffer,
                );
        }

        /* recibe TODOS los datos del libro incluyendo los que debe modificar y los que mantiene
         el id del libro a modicar por route param
         y se modifica solo si pertenece al usuario el libro
        */
        @Put('me/:bookId')
        updateBook(
                @Body() bookDto: BookDto,
                @Param('bookId') bookIdDto: any,
                @GetUser('id') userId: number,
        ) {
                return this.bookService.updateBook(bookDto, bookIdDto, userId);
        }

        /* modifica solo los campos que usuario desea
        en el dto se ponen todos los campos pero con ? , pueden ser nulos,
        entonces se atrapan solo los que completa validamente el usuario
        se pueden modificar solo los libros propios 
        usando la desestructuracion del dto adentro del metodo update de prisma
        where:{
          id: bookId
        },
        data:{
          ...bookOptionalDto,
        }
        te automatchea propiedad y valor de las cosas que existen en el dto
         */
        @Patch('me/:bookId')
        patchBook(
                @Body() bookOptionalDto: any,
                @Param('bookId') bookIdDto: any,
                @GetUser('id') userId: number,
        ) {
                return this.bookService.patchBook(bookOptionalDto, bookIdDto, userId);
        }

        /* antes de eliminar el libro fijarse que sea el dueño y que no este prestado */
        @Delete('me/:bookId')
        deleteBook(@Param('bookId') bookIdDto: any, @GetUser('id') userId: number) {
                return this.bookService.deleteBook(bookIdDto, userId);
        }
}
