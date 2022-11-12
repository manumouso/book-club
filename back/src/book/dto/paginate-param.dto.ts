import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { MyBooksType } from '../enum';


export class PaginateParamDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    MyBooksType.AVAILABLE,
    MyBooksType.BORROWED_FROM_ME,
    MyBooksType.MY_BORROWS,
  ])
  @MaxLength(25)
  type: string;
}
