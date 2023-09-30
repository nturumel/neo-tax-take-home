# Neo.Tax Take-home Starter Code

This is the repo for the starter code for the Neo.Tax take-home assignment. Out of the box, this code implements the [Bezos wallet](https://neo-tax.notion.site/Starter-Code-Overview-Bezos-Wallet-59f7bee0d4664d69a734447cf9eaa95c?pvs=4).

---

## Tech Stack

- React + [Material UI](https://mui.com/)
- Node.js (v18) + [express](https://www.npmjs.com/package/express)
- REST
- Postgres + [Prisma](https://www.prisma.io/)

### Prisma

Prisma is a Typescript ORM compatible with Postgres and a whole host of other databases. In this app, we use Prisma for all of our interactions with the database.

If you're unfamiliar with Prisma, here are a few pointers to help you get up to speed:

- [Prisma Quickstart Guide](https://www.prisma.io/docs/getting-started/quickstart)
  - [Guide on how to add to an existing Prisma project](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgresql)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- We've added the `db:migration:generate` command in the `package.json` to help you generate migration files for the database. Run `npm run db:migration:generate [name_of_migration_file]`, which will use the `prisma` CLI to automatically generate a new migration file for you.

## How To Run The Containerized Dev Environment

We have provided you with a Dockerized version of the app that supports hot
reloading. (Make sure you have [Docker](https://www.docker.com/) installed
before moving forward.) If you make changes in the code while the Docker
container is running, the container will automatically detect those changes
without requiring a restart of the webserver or backend server.

From the project root, run the following to setup the Docker container:

1. `npm run docker:build`
1. `npm run docker:db:migrate` (Run this to set up the database in Docker, or anytime you've changed the schema and you'd like to apply your migrations to to the Postgres Docker container.)
1. `npm run docker:db:seed` (Run this anytime the seed script for the database changes.)

From the project root, run the following to start application:

1. `npm run docker:start`.

You can access the website at [http://localhost:8080/](http://localhost:8080/). This page should update automatically when the client source code changes. The server also transpiles and restarts automatically when its source code changes.

**Note**: You can safely shut down your Docker images using `npm run docker:stop`.

### To connect to the database in the container

1. docker exec -it postgres sh
1. psql -Upostgres neo_tax_take_home

**Note**: You can list tables using `\d`

          neo_tax_take_home=# \d
                          List of relations
          Schema |        Name        |   Type   |  Owner
          --------+--------------------+----------+----------
          public | _prisma_migrations | table    | postgres
          public | merchants          | table    | postgres
          public | merchants_id_seq   | sequence | postgres

## How To Run Locally

Alternatively, if you prefer to develop locally without Docker, follow these instructions to set up your local dev environment.

### Node Setup

If you've never use Node.js before, don't worry! We recommend using
[nvm](https://github.com/nvm-sh/nvm) to install and setup Node.js on your
machine. For this project, please use v18.6.0.

### Database Setup

To run the app locally, you'll need to install Postgres; on MacOS, we recommend using Homebrew:

```bash
brew install postgresql@13
```

(Note: `postgresql@14` or `@15` will probably also work for this assignment. We used v13 when we built this ourselves.)

Once installed, make sure you start the Postgres service so that your application can connect to the database.
With Homebrew, this typically entails running `brew services start postgresql@13` from the command line.

Locally, Prisma will expect a `.env` file that contains a `DATABASE_URL` environment
variable to connect to the database; here's an example:

```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"
```

If you want to run the seed script that populates the database with initial
data, run `npm run db:seed`.

Here are some other database commands that might come in handy:

- `npm run db:migration:deploy`: Applies the migrations to your local database, and also creates the database in Postgres if it doesn't exist.
- `npm run db:prisma:generate`: Updates the `@prisma/client` library locally to be up to date with the `prisma.schema` file in your repo.

### Remaining Setup

Once your local environment is set up, simply run `npm install` to install the
dependencies. Then, you can run the app using `npm run start` from the project
root. The webserver will run on port 8080, and the server will run on port 3000.
