---
id: docs-install
title: Installation
---

## Requirement

* NodeJS X >= 8
* MySQL or other database manager supported by [Sequelize](https://sequelize.org/). If you use another provide than mysql, please change settings in `services/src/configs/instances/database.ts`.

## Setup

To setup this projet, you need to create an empty SQL table in your database nammed `gstStage`. Then, indicate in your `services/.env` file the connection information (host, username, password).

Then you can run `npm i` or `npm install` to run install for both back and front end.

Run `npm run build` to compile every fill and `npm run serve` to start live server.
Live server will be available on port 9500 for graphical interface and 9501 for the API
