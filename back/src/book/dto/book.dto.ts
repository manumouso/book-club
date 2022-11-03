import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsISBN, IsNumber, MaxLength, IsNumberString, isNumberString, IsInt } from 'class-validator';

export class BookDto {
        @IsNotEmpty()
        @IsISBN()
        isbn: string;

        @IsNotEmpty()
        @IsString()
        title: string;

        @IsNotEmpty()
        @Transform(({ value }) => parseInt(value))
        year: number;

        @IsNotEmpty()
        @IsString()
        publisher: string;

        @IsNotEmpty()
        @IsString()
        synopsis: string;

        //Author//
        @IsString()
        firstName: string;

        @IsString()
        lastName: string;

        //Genre//
        @IsString()
        genre: string;

}
