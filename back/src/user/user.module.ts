import { Module } from '@nestjs/common';
import { BookModule } from 'src/book/book.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [BookModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService],
})
export class UserModule {}
