# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and follow instruction below to setup and run the project.

## Required Technologies

Your application must make use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Structure
<pre>
Project Root Directory
├── readme.md
├── images
├── spec
│   ├── src
│   │   ├── routes
│   │   │   ├── productRoutes.spec.ts
│   │   │   └── userRoutes.spec.ts
│   ├── helpers
│   │   ├── reporter.ts
│   └── support
│       └── jasmine.json
├── src
│   ├── controllers
│   │   ├── billControllers.ts
│   │   ├── orderControllers.ts
│   │   ├── productControllers.ts
│   │   └── userControllers.ts
│   ├── handlers
│   │   ├── authHandler.ts
│   │   ├── errorHandler.ts
│   │   └── utils.ts
│   ├── models
│   │   ├── BillModel.ts
│   │   ├── OrderModel.ts
│   │   ├── ProductModel.ts
│   │   └── UserModel.ts
│   ├── routes
│   │   ├── billRoutes.ts
│   │   ├── orderRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── userRoutes.ts
│   ├── types
│   │   └── custom.d.ts
│   ├── database.ts
│   ├── loggers.ts
│   └── server.ts
├── tests
│   ├── storedb_test.dump
│   └── Storefront-be.postman_collection.json
├── .env
├── .gitignore
├── package.json
├── package.json.lock
├── .eslintrc.json
├── .prettierrc
├── eslint.config.mjs
├── tsconfig.json
└── tsconfig.tsbuildinfo
</pre>

## Instructions

Before setting up and running this project, make sure below requirements are install and running in your environment.\
- NodeJS & npm
- docker desktop & docker-compose\
To install, run... Go to project dirrectory and run below command on terminal (or cmd/windows powershell..).

### Setup

#### Install project and dependencies

`npm install`

- Check installation result on terminal. If project installed successfull, `node_module` directory will be created without error.

#### Config and start doker container for database
IMPORTANT NOTE: It is required that docker container is running and test DB is setup before testing and running the server.

- Start docker container\
  `docker-compose up`

- Create database\
  `docker ps`\
  `docker exec -it <container_id> bash`\
  `psql -U postgres`\
  `CREATE DATABASE storedb;`\
  `CREATE DATABASE storedb_test;`\

- Import test db. The sample database can be found as `tests/storedb_test.dump`\
  `docker ps`\
  `docker cp <path_to_host_machine_file.dump> <container_id>:/tmp/storedb_test.dump`\
  `docker exec -it <container_id> pg_restore -U postgres -d storedb_test -c /tmp/storedb_test.dump`\

- Export test db (if-neccessary)\
  `docker ps`\
  `docker exec -it <container_id> pg_dump -U postgres -d storedb_test -F c -f /tmp/storedb_test.dump`\
  `docker cp <container_id>:/tmp/storedb_test.dump <path_to_host_machine_file.dump>`\

#### Environment Variables
- It is required to create an `.env` file with below content and put it in project root directory.\
- Or refer `.env_sample` file as a sample.\

<pre>
SERVER_HOST='localhost'
SERVER_PORT=3000
POSTGRES_HOST='localhost'
POSTGRES_PORT=5432
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='postgres'
POSTGRES_DB='storedb'
POSTGRES_TEST_DB='storedb_test'
NODE_ENV='test'
BCRYPT_PASSWORD='aSecretKey'
SALT_ROUNDS=10
JWT_SECRET='jwt_secret_key'
</pre>

### Build

- To clean and rebuild project:\
  `npm run build`

### Test with Jasmine

- To start running test:\
`npm run test`
- Check the test result on the console.

### Test APIs with Postman
- It is possible to test APIs after the server started with Postman.\
- Import file `test/Storefront-be.postman_collection.json` into Postman and test each API after server started.

### Running
- Start the server:\
  `npm start`

- Check result on console or confirm message when accessing to below url using web browser.\
  `http://localhost:3000/`

## Future development

- Support role-based authentication
- Optimize DB structure and relationship
- Create Frontend side
  ...

## License

This project is modified and updated for study purpose on Udacity.
Refer to https://github.com/manhvgt/nd0067-c2-storefront-be

The original project (starter project) is belong to Udacity https://github.com/udacity/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter
[License](LICENSE.txt)
