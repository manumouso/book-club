import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsISBN,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  //Author//
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  //Genre//
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  genreId: number;
}
