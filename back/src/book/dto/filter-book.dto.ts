import {
  IsAlpha,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class FilterBookDto {
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  @IsAlpha()
  @IsIn([
    'isbn',
    'year',
    'title',
    'genre',
    'publisher',
    'firstName',
    'lastName',
  ])
  filter: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @Matches(/^[a-zA-Z0-9- ]+$/)
  value: any;
}
