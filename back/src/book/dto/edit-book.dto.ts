import { Transform } from 'class-transformer';
import { IsString, IsISBN, IsNumberString, IsOptional } from 'class-validator';

export class EditBookDto {
  @IsISBN()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value))
  year?: number;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  synopsis?: string;

  //Author//
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  //Genre//
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value))
  genreId?: number;
}
