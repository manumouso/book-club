import { Transform } from 'class-transformer';
import {
  IsString,
  IsISBN,
  IsOptional,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class EditBookDto {
  @IsISBN()
  @MaxLength(30)
  @IsOptional()
  isbn?: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  year?: number;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  //Author//
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  authorId?: number;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MaxLength(60)
  @IsOptional()
  lastName?: string;

  //Genre//

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  genreId?: number;
}
