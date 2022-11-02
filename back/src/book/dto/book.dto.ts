/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsISBN, IsPositive, IsNumber, MaxLength } from 'class-validator';


export class BookDto {

        @IsISBN()
        isbn: string;
        //asd

        @IsNotEmpty()
        @IsString()
        title: string;

        @IsNumber()
        @IsPositive()
        @MaxLength(4)
        year: string;

        @IsNotEmpty()
        @IsString()
        publisher: string;

        @IsString()
        synopsis: string;

}
