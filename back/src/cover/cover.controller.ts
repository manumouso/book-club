import { Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CoverService } from './cover.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { removeFile, saveCoverImage } from './helper';
import { FileValidator } from './pipe';
import { GetUser, Public } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('covers')
export class CoverController {
  constructor(private coverService: CoverService) {}

  @Public()
  @Get(':bookId')
  getBookCover(@Param('bookId', ParseIntPipe) bookId: number, @Res() res) {
    const filename = this.coverService.getBookCover(bookId);
    return res.sendFile(filename, {
      root: './images',
    });
  }
  @UseInterceptors(FileInterceptor('file', saveCoverImage))
  @Post(':bookId')
  createBookCover(
    @Param('bookId') bookId: any,
    @GetUser('id') userId: number,
    @UploadedFile(FileValidator)
    file: Express.Multer.File,
  ) {
    try {
      const bookIdToInt = parseInt(bookId);
      if (isNaN(bookIdToInt))
        throw new ForbiddenException('Book Id Must be a Number');

      const fileDto = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileName: file.filename,
      };
      return this.coverService.createBookCover(bookIdToInt, userId, fileDto);
    } catch (error) {
      const imagesFolderPath = join(process.cwd(), 'images');
      const fullCoverImagePath = join(imagesFolderPath + '/' + file.filename);

      removeFile(fullCoverImagePath);

      return { error };
    }
  }

  //guardar extraer el filename viejo eliminar la imagen de images y guardar el nuevo filename
  @UseInterceptors(FileInterceptor('file', saveCoverImage))
  @Patch(':bookId')
  updateBookCover(
    @Param('bookId') bookId: any,
    @GetUser('id') userId: number,
    @UploadedFile(FileValidator)
    file: Express.Multer.File,
  ) {
    try {
      const bookIdToInt = parseInt(bookId);
      if (isNaN(bookIdToInt))
        throw new ForbiddenException('Book Id Must be a Number');

      const fileDto = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileName: file.filename,
      };
      return this.coverService.updateBookCover(bookIdToInt, userId, fileDto);
    } catch (error) {
      const imagesFolderPath = join(process.cwd(), 'images');
      const fullCoverImagePath = join(imagesFolderPath + '/' + file.filename);

      removeFile(fullCoverImagePath);

      return { error };
    }
  }
}
