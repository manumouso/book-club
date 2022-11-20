import { Transform } from 'class-transformer';
import {
  IsString,
  IsISBN,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  Max,
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
  @Min(0)
  @Max(new Date().getFullYear())
  year?: number;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1500)
  synopsis?: string;

  //Author//
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @Min(1)
  @Max(99999)
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
  @Min(1)
  @Max(99999)
  genreId?: number;
}
