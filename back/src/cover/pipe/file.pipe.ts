import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const FileValidator = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png)$/,
  })
  .addMaxSizeValidator({
    maxSize: 5000000,
  })
  .build({
    fileIsRequired: true,
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
