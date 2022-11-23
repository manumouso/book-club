/* eslint-disable */
import { users } from './users';
import { authors } from './authors';
import { genres } from './genres';
import { covers } from './covers';
import { books } from './books';
import * as argon from 'argon2';

import { PrismaClient } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

const prisma = new PrismaClient();

async function main() {
  let userIds = [];
  let authorIds = [];
  let genreIds = [];
  let coverIds = [];
  for (let user of users) {
    let hash = await argon.hash(user.password);
    userIds.push(
      await prisma.user.create({
        data: {
          email: user.email,
          hash: hash,
        },
        select: {
          id: true,
        },
      }),
    );
  }
  for (let author of authors) {
    authorIds.push(
      await prisma.author.create({
        data: author,
        select: {
          id: true,
        },
      }),
    );
  }
  for (let genre of genres) {
    genreIds.push(
      await prisma.genre.create({
        data: genre,
        select: {
          id: true,
        },
      }),
    );
  }
  for (let cover of covers) {
    coverIds.push(
      await prisma.cover.create({
        data: cover,
        select: {
          id: true,
        },
      }),
    );
  }
  const userIdsArr = userIds.map((userIds) => userIds.id);
  const authorIdsArr = authorIds.map((authorIds) => authorIds.id);
  const genreIdsArr = genreIds.map((genreIds) => genreIds.id);
  const coverIdsArr = coverIds.map((coverIds) => coverIds.id);
  let i = 0;
  for (let book of books) {
    if (i >= books.length)
      throw new ForbiddenException(
        'More Books Than Cover Images. Add More Images To covers.ts and ./images',
      );
    let holderPos = getHolderPos(userIdsArr.length);
    let idHolder = null;
    let withdrawn = null;
    if (holderPos !== null) {
      idHolder = userIdsArr[holderPos];
      withdrawn = addHoursToDate(24);      
    }
    await prisma.book.create({
      data: {
        isbn: book.isbn,
        title: book.title,
        year: book.year,
        publisher: book.publisher,
        ownerId: userIdsArr[getRandomPos(userIdsArr.length)],
        holderId: idHolder,
        withdrawnAt: withdrawn,
        authorId: authorIdsArr[getRandomPos(authorIdsArr.length)],
        genreId: genreIdsArr[getRandomPos(genreIdsArr.length)],
        coverId: coverIdsArr[i++],
      },
    });
  }
}

function getRandomPos(numberIds: number) {
  return Math.floor(Math.random() * numberIds);
}

function getHolderPos(numberIds: number) {
  if (Math.random() < 0.7) {
    return Math.floor(Math.random() * numberIds);
  }
  return null;
}

function addHoursToDate(intHours) {
  let date = new Date();
  let numberOfMlSeconds = date.getTime();
  let addMlSeconds = (intHours * 60) * 60000;
  
  return new Date(numberOfMlSeconds + addMlSeconds);;
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
