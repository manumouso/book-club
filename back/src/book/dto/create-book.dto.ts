import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsISBN,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  @IsNotEmpty()
  @MaxLength(30)
  isbn: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  publisher: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  //Author//
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  authorId?: number;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  lastName: string;

  //Genre//
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  genreId: number;
}
