---
id: docs-frontend
title: Front end part
---

The webapp is the front-end part of the internships manager developped in [TypeScript](https://www.typescriptlang.org/) using [VueJS](https://vuejs.org/). It is used to render all internships info and to easly configure campagnes for internships management.

## Front end code structure

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

## Front end CMD

* `npm run server`: Run server in dev mode
* `npm run build:prod`: Build server in production mode
* `npm run build:stage`: Build server in staging mode
* `npm run lint`: Run linter on *src* files
* `npm run svg`: Build icon
* `npm run test:unit`: Run unit test
* `npm run test:e2e`: Run end-to-end test
