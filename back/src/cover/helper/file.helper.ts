import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import * as fs from 'fs';
import path = require('path');

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

export const renameFile = (filename: string, bookId: number) => {
  const newName = bookId + 'bookId' + filename;
  fs.rename(filename, newName, (err) => {
    if (err) throw err;
    console.log('file name updated');
  });
};
