import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CoverService } from './cover.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { getPath, removeFile, saveCoverImage } from './helper';
import { FileValidator } from './pipe';
import { GetUser, Public } from 'src/auth/decorator';
import { validateId } from 'src/book/helper';

@UseGuards(JwtGuard)
@Controller('covers')
export class CoverController {
  constructor(private coverService: CoverService) {}

  @Public()
  @Get(':bookId')
  async getBookCover(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Res() res,
  ) {
    validateId(bookId);
    const filename: string = await this.coverService.getBookCover(bookId);
    return res.sendFile(filename, {
      root: './images',
    });
  }
  //don't change '@Param('bookId') bookId: any'
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
      validateId(bookIdToInt);

      const fileDto = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileName: file.filename,
      };
      return this.coverService.createBookCover(bookIdToInt, userId, fileDto);
    } catch (error) {
      const coverPath = getPath(file.filename);
      removeFile(coverPath);

      throw error;
    }
  }

  //don't change '@Param('bookId') bookId:any'
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
      validateId(bookIdToInt);

      const fileDto = {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileName: file.filename,
      };
      return this.coverService.updateBookCover(bookIdToInt, userId, fileDto);
    } catch (error) {
      const coverPath = getPath(file.filename);
      removeFile(coverPath);

      throw error;
    }
  }
}
