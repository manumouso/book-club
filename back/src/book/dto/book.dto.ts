import { IsString, IsNotEmpty, IsISBN, IsPositive, IsNumber, MaxLength } from 'class-validator';

export class BookDto {
        @IsNotEmpty()
        @IsISBN()
        isbn: string;

        @IsNotEmpty()
        @IsString()
        title: string;

        @IsNotEmpty()
        @IsNumber()
        @IsPositive()
        @MaxLength(4)
        year: string;

        @IsNotEmpty()
        @IsString()
        publisher: string;

        @IsNotEmpty()
        @IsString()
        synopsis: string;

        @IsString()
        autor: string;

        ///////////////// GENRE ?? /////////////////

}
