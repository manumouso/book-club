import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookDto } from './dto';
// crear Dtos de author y de genero??

@Injectable()
export class BookService {
        constructor(private prisma: PrismaService) { }

        async getBooks() {
                return await this.prisma.book.findMany({
                        include: {
                                cover: true,
                                author: true,
                                genre: true
                        }
                }).then(books => {
                        books.map(book => {
                                const coverImage = book.cover.imageData.toString('base64')
                                book['imageData'] = coverImage
                                delete book.ownerId
                                delete book.createdAt
                                delete book.withdrawnAt
                                delete book.authorId
                                delete book.author.id
                                delete book.cover.id
                                delete book.coverId
                                delete book.holderId
                                delete book.genre.id
                                delete book.genreId
                                delete book.cover.imageData

                        })
                        return books
                }).then(books => {
                        return Promise.resolve(books);
                });
        }

        async filterBooks(filterDto: any, valueDto: any) { }

        async getDetails(bookIdDto: number) { }

        async getMyBooks(userId: number) { }

        async createBook(
                bookDto: BookDto,
                userId: number,
                originalname: string,
                mimetype: string,
                buffer: Buffer,
        ) {
                try {
                        const author = await this.prisma.author.create({
                                data: {
                                        firstName: bookDto.firstName,
                                        lastName: bookDto.lastName,
                                }
                        })
                        const genre = await this.prisma.genre.create({
                                data: {
                                        name: bookDto.genre,
                                }
                        })
                        const image = await this.prisma.cover.create({
                                data: {
                                        imageType: mimetype,
                                        imageName: originalname,
                                        imageData: buffer,
                                }
                        })
                        const book = await this.prisma.book.create({
                                data: {
                                        isbn: bookDto.isbn,
                                        title: bookDto.title,
                                        year: bookDto.year,
                                        publisher: bookDto.publisher,
                                        synopsis: bookDto.synopsis,
                                        authorId: author.id,
                                        genreId: genre.id,
                                        coverId: image.id,
                                        ownerId: userId,
                                }
                        })
                        return book;
                } catch (error) {
                        throw error;

                }
        }

        async updateBook(bookDto: any, bookIdDto: number, userId: number) { }

        async patchBook(bookOptionalDto: any, bookIdDto: number, userId: number) { }

        async deleteBook(bookIdDto: any, userId: number) { }
}
