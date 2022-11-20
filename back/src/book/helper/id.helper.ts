import { ForbiddenException } from '@nestjs/common';
import { isPositive } from 'class-validator';

export const validateId = (id) => {
  if (isNaN(id) || id.toString().length > 8 || !isPositive(id))
    throw new ForbiddenException('Id Must Be a Positive Integer');
};
