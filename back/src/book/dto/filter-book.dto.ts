import {
  IsAlpha,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { FilterBookType } from '../enum';

export class FilterBookDto {
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  @IsAlpha()
  @IsIn([
    FilterBookType.ISBN,
    FilterBookType.TITLE,
    FilterBookType.YEAR,
    FilterBookType.PUBLISHER,
    FilterBookType.GENRE,
    FilterBookType.FIRSTNAME,
    FilterBookType.LASTNAME,
  ])
  filter: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @Matches(/^[a-zA-Z0-9- ]+$/)
  value: any;
}
