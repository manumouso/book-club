<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## CRUD REST API

Book Club API using NestJS, Docker, Postgres, PassportJS, Prisma ORM, Argon2, Multer and Dotenv.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# start postgres in docker and push migrations
$ yarn db:dev:restart

# start api in dev watch mode
$ yarn start:dev

# seed database
$ yarn db:dev:seed
```

## Endpoints

- Auth

  - Public
  
    - POST /auth/signup

    - POST /auth/signin
    
      Request: Body: { email, password }
      
      Response: { access_token }

- Author

  - Public
  
    - GET /authors
    
      Response: { authors }

- Book

  - Public
  
    - GET /books
    
      Response: { books }

    - GET /books/amount 
    
      Response: { amount }

    - GET /books/paginate
    
      Request: Query: { take, cursor?, booksLeftToTake? }
      
      Response: { books, take, cursor, booksLeftToTake }

  - Authorization ---> Request: Header: { Authorization: Bearer access_token }

    - GET /books/filterBy
    
      Request: Query: { filter, value }
      
      Response: { books }

    - GET /books/details/:bookId
    
      Request: Param: { bookId }
      
      Response: { book }

    - GET /books/me
    
      Response: { myBooks: { booksBorrowedFromMe, availableBooks }, myBorrows }

    - GET /books/me/amounts
    
      Response: { amounts }

    - GET /books/me/paginate/available
    
      Request: Query: { take, cursor?, booksLeftToTake? }
      
      Response: { books, take, cursor, booksLeftToTake }

    - GET /books/me/paginate/borrowedFromMe
    
      Request: Query: { take, cursor?, booksLeftToTake? }
      
      Response: { books, take, cursor, booksLeftToTake }

    - GET /books/me/paginate/myBorrows
    
      Request: Query: { take, cursor?, booksLeftToTake? }
      
      Response: { books, take, cursor, booksLeftToTake }

    - POST /books/me
    
      Request: Body: { isbn, title, year, publisher, synopsis?, authorId?, firstName?, lastName, genreId }
      
      Response: { book }

    - PATCH /books/me/:bookId
    
      Request: Param: { bookId }, Body: { isbn?, title?, year?, publisher?, synopsis?, authorId?, firstName?, lastName?, genreId? }
      
      Response: { updatedBook }

    - DELETE /books/me/:bookId
    
      Request: Param: { bookId }
      
      Response: { deletedBook }

- Cover

  - Public

    - GET /covers/:bookId
    
      Request: Param: { bookId }
      
      Response: File (CoverImage)

  - Authorization ---> Request: Header: { Authorization: Bearer access_token }

    - POST /covers/:bookId
    
      Request: Param: { bookId }, File (field name:'file')
      
      Response: { bookId, coverImage }

    - PATCH /covers/:bookId
    
      Request: Param: { bookId }, File (field name:'file')
      
      Response: { bookId, updatedCoverImage }

- Genre

  - Public

    - GET /genres
    
      Response: { genres }

- User

  - Authorization ---> Request: Header: { Authorization: Bearer access_token }

    - PATCH /users/me/borrows/:bookId
    
      Request: Param: { bookId }
      
      Response: { borrowedBookId }

    - PATCH /users/me/returns/:bookId
    
      Request: Param: { bookId }
      
      Response: { returnedBookId }

```bash
- '?': Is an optional field, if it is present in the form even if the value is null or '' 
  it is taken as the field has a value and will be validated.
  Not including it in the form is correct when you do not want to send the data
- PORT: 3333
```

## License

MIT licensed.
