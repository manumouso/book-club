import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { validateId } from 'src/book/helper';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('me/borrows/:bookId')
  borrowBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @GetUser('id') userId: number,
  ) {
    validateId(bookId);
    return this.userService.borrowBook(bookId, userId);
  }

  @Patch('me/returns/:bookId')
  returnBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @GetUser('id') userId: number,
  ) {
    validateId(bookId);
    return this.userService.returnBook(bookId, userId);
  }
}
