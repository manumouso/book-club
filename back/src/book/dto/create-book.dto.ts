import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsISBN,
  IsOptional,
  IsNumber,
  MaxLength,
  IsInt,
  Min,
  Max,
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
  @IsInt()
  @Min(0)
  @Max(new Date().getFullYear())
  @Transform(({ value }) => parseInt(value))
  year: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  publisher: string;

  @IsString()
  @IsOptional()
  @MaxLength(1500)
  synopsis?: string;

  //Author//
  @IsNumber()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99999)
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
  @IsInt()
  @Min(1)
  @Max(99999)
  @Transform(({ value }) => parseInt(value))
  genreId: number;
}
