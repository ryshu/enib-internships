---
id: docs-install
title: Installation
---

## Requirement

* NodeJS X >= 8
* MySQL or other database manager supported by [Sequelize](https://sequelize.org/). If you use another provide than mysql, please change settings in `services/src/configs/instances/database.ts`.

## Setup a running developpement server

To set up this project, you need to create an empty SQL table in your database named `gstStage`. Then, indicate in your `services/.env` file the connection information (host, username, password).

The `.env` file must contain followings code. To get detail about this part, go to [settings](docs-settings) in documentation.

``` sh
# Note we depend on NODE_ENV being set to dictate which of the env variables below get loaded at runtime.
# See README for more details.

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_DATABASE=internships
MYSQL_PASSWORD=

# Set true to drop database on server start
ORM_DROP_DB_ON_START=false
ORM_LOGGING=false

# Put lots of randomness in these
SESSION_SECRET=ashdfjhasdlkjfhalksdjhflak
HASH_KEY=gLgk8Nt7ograVzCsgQz1JM05QJtpzDbk

# API Version
INTERNSHIP_ENIB_API_VERSION=v1
INTERNSHIP_ENIB_API_PORT=4000
```

Then you can run `npm i` or `npm install` to run install for both back and front end.

Run `npm run build` to compile every fill and `npm run serve` to start the live server.
The live server will be available on port 4000 for graphical interface and 9527 for the API

* API: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
* Interface: [http://localhost:9527](http://localhost:9527)
