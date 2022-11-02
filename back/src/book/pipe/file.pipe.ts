import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const FileValidator = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png|gif)$/,
  })
  .addMaxSizeValidator({
    maxSize: 500000,
  })
  .build({
    fileIsRequired: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
