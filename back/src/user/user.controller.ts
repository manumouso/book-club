import { Controller,Param, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService /*Inyectar todos los dto creados*/,
  ) {}

  /* estos rutas le pegan a la base(servicio) y lo que hacen es modificar
     los campos holderId y withdrawnAt(Date)
     borrow: holderId = userId y withdrawnAt = funcion de date now() cuando ocurre la op
     return: holderId= NULL y withdrawnAt= NULL
     estos patch no requieren body
     agregar el dto para validar bookId y reemplazar el tipo de dato any por el nombre de la clase
     
  */
  @Patch('me/borrows/:bookId')
  borrowBook(@Param('bookId') bookIdDto: any, @GetUser('id') userId: number) {
    return this.userService.borrowBook(bookIdDto, userId);
  }

  @Patch('me/returns/:bookId')
  returnBook(@Param('bookId') bookIdDto: any, @GetUser('id') userId: number) {
    return this.userService.returnBook(bookIdDto, userId);
  }
}
