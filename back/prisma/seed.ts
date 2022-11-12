import { users } from './users';
import { authors } from './authors';
import { genres } from './genres';
import { books } from './books';
import * as argon from 'argon2';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let userIds = [];
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
  const idsArr = userIds.map((userIds) => userIds.id);
  console.log(idsArr);
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
