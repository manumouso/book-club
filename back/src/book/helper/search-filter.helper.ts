/* eslint-disable */
//don't add a semicolon to the penultimate bracket
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
      withdrawnAt: true,
    },    
  }
};
//don't add a semicolon to the penultimate bracket
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
//don't add a semicolon to the penultimate bracket
export const myBorrows = (userId) => {
  return {
    where: {
      holderId: userId,
    },
    select: {
      id: true,
      title: true,
      author: {
        select: {
          lastName: true,
        },
      },
      withdrawnAt: true,
      owner: {
        select: {
          email: true,
        },
      },
    },
  }
};
//don't add a semicolon to the penultimate bracket
export const getAllBooks = () => {
  return {    
    select: {
      id: true,
      isbn:true,
      title: true,
      publisher:true,
      year:true,
      coverId:true,
      author: {
        select: {
          lastName: true,
        },
      },
      genre: {
        select: {
          name: true,
        },
      },
    },
  }
};