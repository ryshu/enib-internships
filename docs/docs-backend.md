---
id: docs-backend
title: Back end part
---

Backend part of the project is contain under the `services` directory. We decide to separate back-end and front-end with an Express API to be able to easly deploy multiple front-end view and separate data management from visualization.

The back-end part was developed using [TypeScript](https://www.typescriptlang.org/).

## Back end code structure

Under the back-end directory `services`, you will be able to find the following code architecture:

* **devops/** (Scripts for setup and preparations)
* **dist/** (Compiled files)
* **node_modules/** (All dependecies are here after you run `npm i`)
* **src/** (directory for [TypeScript](https://www.typescriptlang.org/) code)
  * **api/** (all API files)
    * **controllers/** (Declare methods to handle each endpoints)
    * **helpers/** (Declare methods to factorize)
    * **routers/** (Declare route of API for each endpoints)
    * **validators/** (Declare schema for validate given data)

  * **configs/** (files used for configuration and setup of the server)
  * **declarations/** (Declaration of all interfaces used in projects)
  * **models/** (Every models used to isolate database from code, coded for [Sequelize](https://sequelize.org/master/manual/typescript.html) )
  * **utils/** (Every utility files)
  * *app.ts* (application file, prepare the application without running it)
  * *server.ts* (run server entry point)

* *.env* (environment variables to config database and api - [DotEnv](https://github.com/motdotla/dotenv))
* *jest.config.js* (configuration file for [Jest](https://jestjs.io/) - CI)
* *montoring.*.log* (log files to debug API using [Winston](https://github.com/winstonjs/winston))
* *package.json* ([npm](https://www.npmjs.com/) package and dependecie configuration)
* *tsconfig.json* ([TypeScript](https://www.typescriptlang.org/) configuration file)
* *tslint.json* ([TypeScript](https://www.typescriptlang.org/) linter configs)

## Back end CMD

* `npm run build`: Compile back-end server
* `npm run serve`: Run server
* `npm run watch`: Run server and reload on file save
* `npm run test`: Run test for server
* `npm run lint`: Run linter on *src* files
* `npm run debug`: Run server in debug mode and reload on file save
