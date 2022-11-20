import { forwardRef, Module } from '@nestjs/common';
import { BookModule } from 'src/book/book.module';
import { CoverController } from './cover.controller';
import { CoverService } from './cover.service';

@Module({
  imports:[forwardRef(() => BookModule)],
  controllers: [CoverController],
  providers: [CoverService],
  exports:[CoverService],
})
export class CoverModule {}
