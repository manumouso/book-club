import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CoverModule } from './cover/cover.module';
import { AuthorModule } from './author/author.module';
import { GenreModule } from './genre/genre.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookModule,
    PrismaModule,
    CoverModule,
    AuthorModule,
    GenreModule,
  ],
})
export class AppModule {}
