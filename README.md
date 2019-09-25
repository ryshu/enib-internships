# Internships manager

[![Total alerts](https://img.shields.io/lgtm/alerts/g/ryshu/enib-internships.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ryshu/enib-internships/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ryshu/enib-internships.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ryshu/enib-internships/context:javascript)

**TODO**: Description

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
* [Credits](#credits)
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
  * **pwa/** (File link to progressive web application [@see Vue-pwa](https://medium.com/the-web-tub/creating-your-first-vue-js-pwa-project-22f7c552fb34))
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

TODO

## Contribution

* Oscar MARIE--TAILLEFER <oscar@leeap.cash>

## Credits

TODO

## Licence

TODO

## Usefull links

TODO
