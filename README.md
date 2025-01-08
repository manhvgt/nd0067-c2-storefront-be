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

Before setting up and running this project, make sure NodeJS & npm along with docker & docker-compose are installed in your environment.
To install, run... Please go to project dirrectory and run below command on terminal (or cmd/windows powershell..).

### Setup

#### Install project and dependencies

`npm install`

- Check installation result on terminal. If project installed successfull, `node_module` directory will be created without error.

#### Config and start doker container for database

- Start docker container
  `docker-compose up`

- Create database
  `docker ps`
  `docker exec -it <container_name_or_id> bash`

- Create database 
  `psql -U postgres`
  `CREATE DATABASE storedb;`
  `CREATE DATABASE storedb_test;`

- Import test db
  `docker ps`
  `docker cp <path_to_host_machine_file.dump> <container_id>:/tmp/storedb_test.dump`
  `docker exec -it <container_id> pg_restore -U postgres -d storedb_test -c /tmp/storedb_test.dump`

- Export test db (if-neccessary)
  `docker ps`
  `docker exec -it <container_id> pg_dump -U postgres -d storedb_test -F c -f /tmp/storedb_test.dump`
  `docker cp <container_id>:/tmp/storedb_test.dump <path_to_host_machine_file.dump>`

#### Environment Variables

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

### Build

- To clean and rebuild project:\
  `npm run build`

### Test

`npm run test`

- Check the test result.

### Running

- Start backend:\
  `npm start`

- Start the app using below api url. You can replace INPUT_IMAGE_PATH by actual image path and/or change width/height.\
   It is OK to put image filename instead of full path, it will be auto redirected to default image directory.\
   API parameters will be validated and an error will be returned in case of invalid parameter.\
  `http://localhost:3000/api/image?inputPath=INPUT_IMAGE_PATH&width=400&height=400`\

## Future development

- Support video
- Support source image/video from url instead of local filepath
  ...

## License

This project is modified and updated for study purpose on Udacity.
Refer to https://github.com/manhvgt/cd0292-ImageProcessingAPI

The original project (starter project) is belong to Udacity https://github.com/udacity/cd0292-building-a-server-project-starter
[License](LICENSE.txt)
