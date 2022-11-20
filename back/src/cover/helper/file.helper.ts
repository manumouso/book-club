import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import * as fs from 'fs';
import path = require('path');
import { join } from 'path';

type validFileExtension = 'png' | 'jpeg' | 'jpg';
type validMimeType = 'image/png' | 'image/jpeg' | 'image/jpg';

const validFileExtension: validFileExtension[] = ['png', 'jpeg', 'jpg'];
const validMimeType: validMimeType[] = ['image/png', 'image/jpeg', 'image/jpg'];

export const saveCoverImage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeType;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
  limits: {
    fileSize: 5000000,
  },
};

export const removeFile = (fullFilePath: string) => {
  fs.unlink(fullFilePath, (err) => {
    if (err) throw err;
    console.log('file deleted');
  });
};

export const getPath = (filename: string): string => {
  const imagesFolderPath = join(process.cwd(), 'images');
  const coverImagePath = join(imagesFolderPath + '/' + filename);

  return coverImagePath;
};
