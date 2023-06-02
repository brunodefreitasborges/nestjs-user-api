# User Authentication API

This is a study project of using NestJS to implement an user CRUD with JWT authentication.

## How to run

1 - Install the necessary dependencies

```
npm install
```

2 - Create a file named '.env' in the root of the project.

3 - Add the following line in order to point to the local SQLite DB:
```
DATABASE_URL=file:dev.db
```

4 - Add a random string to serve as the JWT secret:
```
SECRET_KEY=nnuoibebgfeiury4895y345
```

5 - Start the project on localhost:3000

```
npm run start:dev
```