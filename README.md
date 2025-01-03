# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Required Technologies

Your application must make use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to Completion

### 1. Plan to Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend. This is much like a document you might come across in real life when building or extending an API.

Your first task is to read the requirements and update the document with the following:

- Determine the RESTful route for each endpoint listed. Add the RESTful route and HTTP verb to the document so that the frontend developer can begin to build their fetch requests.  
  **Example**: A SHOW route: 'blogs/:id' [GET]

- Design the Postgres database tables based off the data shape requirements. Add to the requirements document the database tables and columns being sure to mark foreign keys.  
  **Example**: You can format this however you like but these types of information should be provided
  Table: Books (id:varchar, title:varchar, author:varchar, published_year:varchar, publisher_id:string[foreign key to publishers table], pages:number)

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables. Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple tables to store a single shape.

### 2. DB Creation and Migrations

Now that you have the structure of the databse outlined, it is time to create the database and migrations. Add the npm packages dotenv and db-migrate that we used in the course and setup your Postgres database. If you get stuck, you can always revisit the database lesson for a reminder.

You must also ensure that any sensitive information is hashed with bcrypt. If any passwords are found in plain text in your application it will not pass.

### 3. Models

Create the models for each database table. The methods in each model should map to the endpoints in `REQUIREMENTS.md`. Remember that these models should all have test suites and mocks.

### 4. Express Handlers

Set up the Express handlers to route incoming requests to the correct model method. Make sure that the endpoints you create match up with the enpoints listed in `REQUIREMENTS.md`. Endpoints must have tests and be CORS enabled.

### 5. JWTs

Add JWT functionality as shown in the course. Make sure that JWTs are required for the routes listed in `REQUIUREMENTS.md`.

### 6. QA and `README.md`

Before submitting, make sure that your project is complete with a `README.md`. Your `README.md` must include instructions for setting up and running your project including how you setup, run, and connect to your database.

Before submitting your project, spin it up and test each endpoint. If each one responds with data that matches the data shapes from the `REQUIREMENTS.md`, it is ready for submission!

## Structure

<pre>
Project Root Directory
├── readme.md
├── images
├── spec
│   ├── api
│   │   └── image.spec.ts
│   ├── helpers
│   ├── support
│   └── index.spec.ts
├── src
│   ├── api
│   │   └── image.ts
│   ├── handlers
│   │   └── imageResizer.ts
│   └── index.ts
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

#### Environment Variables

    POSTGRES_HOST='postgres'
    POSTGRES_PORT='5432'
    POSTGRES_USER='postgres'
    POSTGRES_PASSWORD='postgres'
    POSTGRES_DB='storedb'

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
