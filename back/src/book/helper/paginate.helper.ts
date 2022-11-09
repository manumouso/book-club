export const booksBorrowedFromMe = (userId) => {
  return {
    where: {
      ownerId: userId,
      holderId: {
        not: null,
      },
    },
    select: {
      id: true,
      title: true,
      withdrawnAt: true,
      author: {
        select: {
          lastName: true,
        },
      },
      holder: {
        select: {
          email: true,
        },
      },
    },    
  }
};

export const availableBooks = (userId) => {
  return {
    where: {
      ownerId: userId,
      holderId: null,
    },
    select: {
      id: true,
      title: true,
      author: {
        select: {
          lastName: true,
        },
      },
    },
  }
};

export const myBorrows = (userId) => {
  return {
    where: {
      holderId: userId,
    },
    select: {
      id: true,
      title: true,
      withdrawnAt: true,
      author: {
        select: {
          lastName: true,
        },
      },
      owner: {
        select: {
          email: true,
        },
      },
    },
  }
};
