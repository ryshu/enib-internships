# [Internships manager](https://ryshu.github.io/enib-internships/)

[![Build Status](https://travis-ci.org/ryshu/enib-internships.svg?branch=master)](https://travis-ci.org/ryshu/enib-internships) [![codecov](https://codecov.io/gh/ryshu/enib-internships/branch/master/graph/badge.svg)](https://codecov.io/gh/ryshu/enib-internships)

**Sonar - backend**: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.backend&metric=alert_status)](https://sonarcloud.io/dashboard?id=enib.internships.backend) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.backend&metric=coverage)](https://sonarcloud.io/dashboard?id=enib.internships.backend) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.backend&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=enib.internships.backend) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.backend&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=enib.internships.backend) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.backend&metric=security_rating)](https://sonarcloud.io/dashboard?id=enib.internships.backend)

**Sonar - frontend**: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.frontend&metric=alert_status)](https://sonarcloud.io/dashboard?id=enib.internships.frontend) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.frontend&metric=coverage)](https://sonarcloud.io/dashboard?id=enib.internships.frontend) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.frontend&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=enib.internships.frontend) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.frontend&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=enib.internships.frontend) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=enib.internships.frontend&metric=security_rating)](https://sonarcloud.io/dashboard?id=enib.internships.frontend)

## Summary

* [Requirement](#requirement)
* [Setup](#setup)
* [Back-end](#back-end)
  * [Structure](#back-end-code-structure)
  * [CMD](#back-end-cmd)
* [Front-end](#front-end)
  * [Structure](#front-end-code-structure)
  * [CMD](#front-end-cmd)
* [Documentation](#documentation)
* [Contribution](#contribution)
* [Licence](#licence)
* [Usefull links](#usefull-links)

## Requirement

* NodeJS X >= 8
* MySQL or other database manager supported by [Sequelize](https://sequelize.org/). If you use another provide than mysql, please change settings in `services/src/configs/instances/database.ts`.

## Setup

To setup this projet, you need to create an empty SQL table in your database nammed `gstStage`. Then, indicate in your `services/.env` file the connection information (host, username, password).

Then you can run `npm i` or `npm install` to run install for both back and front end.

Run `npm run build` to compile every fill and `npm run serve` to start live server.
Live server will be available on port 9500 for graphical interface and 9501 for the API

## Back end

Backend part of the project is contain under the `services` directory. We decide to separate back-end and front-end with an Express API to be able to easly deploy multiple front-end view and separate data management from visualization.

The back-end part was developed using [TypeScript](https://www.typescriptlang.org/).

### Back end code structure

Under the back-end directory `services`, you will be able to find the following code architecture:

* **devops/** (Scripts for setup and preparations)
* **dist/** (Compiled files)
* **node_modules/** (All dependecies are here after you run `npm i`)
* **src/** (directory for [TypeScript](https://www.typescriptlang.org/) code)
  * **api/** (all API files)
    * **controllers/** (Declare methods to handle each endpoints)
    * **helpers/** (Declare methods to factorize)
    * **processors/** (Declare methods to process given data)
    * **routers/** (Declare route of API for each endpoints)
    * **validators/** (Declare schema for validate given data)

  * **auth/** (all files link to authentication)
    * **cas/** (all files link to authentication via [CAS](https://apereo.github.io/cas/6.1.x/index.html))

  * **configs/** (files used for configuration and setup of the server)
  * **declarations/** (Declaration of all interfaces used in projects)
  * **emails/** (Email services)
    * **build/** (Files use during templates builds)
    * **templates/** (All emails templates, 1 directory = 1 template)

  * **files-storage/** (Files storages service)
  * **helpers/** (Global helpers)
  * **internship/** (Internship service, including FSM)
  * **models/** (Every models used to isolate database from code, coded for [Sequelize](https://sequelize.org/master/manual/typescript.html) )
    * **sequelize/** (All sequelizes models)

  * **utils/** (Every utility files)
  * **websocket/** (Websocket service, see [socket.io](https://socket.io/))
  * *app.ts* (application file, prepare the application without running it)
  * *server.ts* (run server entry point)

* *.env* (environment variables to config database and api - [DotEnv](https://github.com/motdotla/dotenv))
* *jest.config.js* (configuration file for [Jest](https://jestjs.io/) - CI)
* *montoring.*.log* (log files to debug API using [Winston](https://github.com/winstonjs/winston))
* *package.json* ([npm](https://www.npmjs.com/) package and dependecie configuration)
* *tsconfig.json* ([TypeScript](https://www.typescriptlang.org/) configuration file)
* *tslint.json* ([TypeScript](https://www.typescriptlang.org/) linter configs)

### Back end CMD

* `npm run build`: Compile back-end server
* `npm run serve`: Run server
* `npm run watch`: Run server and reload on file save
* `npm run test`: Run test for server
* `npm run lint`: Run linter on *src* files
* `npm run debug`: Run server in debug mode and reload on file save

## Front end

The webapp is the front-end part of the internships manager developped in [TypeScript](https://www.typescriptlang.org/) using [VueJS](https://vuejs.org/). It is used to render all internships info and to easly configure campagnes for internships management.

### Front end code structure

Under the front-end directory `app`, you will be able to find the following code architecture:

* **dist/** (Compiled files)
* **node_modules/** (All dependecies are here after you run `npm i`)
* **public/** (All static files of the application)
* **src/** (All developpements files)
  * **api/** (API interface to handle server API calls)
  * **assets/** (every static files in applications as photos, movies ... )
  * **components/** (Every components used in the view)
  * **directives/** (Every [directives](https://vuejs.org/v2/api/#Vue-directive) for vue components)
  * **filters/** (Every [filter](https://vuejs.org/v2/api/#Vue-filter) for vue components)
  * **icons/** (Every icons used in application)
  * **lang/** (Languages files [@see Vue-i18n](https://kazupon.github.io/vue-i18n/))
  * **layout/** (Components to compose layout of application)
  * **router/** (Router of application [@see Vue-router](https://router.vuejs.org/))
  * **store/** (Shared store of application [@see Vuex](https://vuex.vuejs.org/))
  * **styles/** (Every styles sheets)
  * **utils/** (Utils file to manage various case)
  * **views/** (All views of the application)
* **tests/** (Tests directory for [Jest](https://jestjs.io/) and [Cypress](https://www.cypress.io/))
* *.browserslistrc* (list of all suported browsers)
* *.env.** (environment variables to config API connection - [DotEnv](https://github.com/motdotla/dotenv))
* *.eslintignore* (ignore file for [eslint](https://eslint.org/) linter)
* *.eslintrc.js*  (config file for [eslint](https://eslint.org/) linter)
* *.prettierrc.js* (config file for [prettier](https://github.com/prettier/prettier) plugin)
* *babel.config.js* (config file for [babel](https://babeljs.io/), the [VueJS](https://vuejs.org/) transpiler)
* *cypress.json* (config file for [E2E](https://www.cypress.io/features) framework [cypress](https://www.cypress.io/))
* *jest.config.json* (config file for [Jest](https://jestjs.io/) test framework)
* *package.json* ([npm](https://www.npmjs.com/) package and dependecie configuration)
* *postcss.config.js* (config file for [PostCSS](https://postcss.org/), style compilator in [VueJS](https://vuejs.org/))
* *tsconfig.json* ([TypeScript](https://www.typescriptlang.org/) configuration file)
* *vue.config.js*  (config file for [VueJS](https://vuejs.org/))

### Front end CMD

* `npm run server`: Run server in dev mode
* `npm run build:prod`: Build server in production mode
* `npm run build:stage`: Build server in staging mode
* `npm run lint`: Run linter on *src* files
* `npm run svg`: Build icon
* `npm run test:unit`: Run unit test
* `npm run test:e2e`: Run end-to-end test

## Documentation

Available [here](https://ryshu.github.io/enib-internships/)

## Contribution

* Oscar MARIE--TAILLEFER <oscar@leeap.cash>
* André FELIX
* Adrien Tissier <a5tissie@enib.fr>

## Licence

MIT License

Copyright (c) 2019 Oscar MARIE--TAILLEFER

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Usefull links

* Base template: [Vue Typescript Admin Template](https://github.com/Armour/vue-typescript-admin-template)
* Vue framework: [Element](https://element.eleme.io/#/fr-FR/component/installation)
* Vue JS documentation: [VueJS](https://vuejs.org/v2/guide/)
* Test framework: [Jest](https://jestjs.io/docs/en/getting-started)
* [Typescript](https://www.typescriptlang.org/docs/home.html)
* Mailer documentation: [Nodemailer](https://nodemailer.com/about/) and [email-templates](https://www.npmjs.com/package/email-templates)
* CAS authentication: [cas-authentication](https://www.npmjs.com/package/cas-authentication)
* Websocket: [socket-io](https://socket.io/)
* Web visualisation: [Echarts](https://echarts.apache.org/en/index.html)
