---
id: tuto-mentors
title: Setup mentors
---

In this tutorial, will see every steps to setup the default mentor view.
At the end, we will be able to:

* List mentors
* Create a new mentor
* Update mentor data
* Export the mentor list

We will use this interface throughout this tutorial

``` javascript
declare interface IMentorEntity {
    id?: Number;

    firstName: String;
    lastName: String;
    email: String;

    createdAt?: Date;
    updatedAt?: Date;
}
```

## Create branch on github

To name a branch, the best way is to use the name of the feature that you want to add, precede by the action that is performed.
For example:

* If you want to fix mentors struct, call your branch `fix-mentors-struct`
* If you want to add mentoring proposition, call your branch `add-mentoring-proposition`

### Using command line

```sh
git branch add-mentors
git checkout add-mentors
```

### Using gitkraken

1. Click on branch
2. Enter branch name `add-mentors`
3. Press enter

![gitkraken-add-branch](../img/tuto/gitkraken-add-branch.png)

## Create data and road in back-end

In this step of tutorial, we want to handle mentors data in the API.
To do so, we will observe the different steps for the implementation of this data.

### Create controller

First of all, create the mentor controller under `services/src/api/controllers/mentors.ctrl.ts`.
Before any implementation, we want to configure the 5 methods we will use in the API to manage mentors.

Create the `mentors.ctrl.ts` files and add following implementations:

``` typescript
import { Request, Response, NextFunction } from 'express';

/**
 * GET /mentors
 * Used to GET all mentors
 */
export const getMentors = (_req: Request, res: Response, next: NextFunction): void => { };

/**
 * POST /mentorss
 * Used to create a new mentor entry
 */
export const postMentor = (req: Request, res: Response, next: NextFunction): void => { };

/**
 * GET /mentors/:id
 * Used to select a mentor by ID
 */
export const getMentor = (req: Request, res: Response, next: NextFunction): void => { };

/**
 * PUT /mentors/:id
 * Used to update mentor values
 */
export const putMentor = (req: Request, res: Response, next: NextFunction): void => { };

/**
 * DELETE /mentors/:id
 * Used to remove a mentor from database
 */
export const deleteMentor = (req: Request, res: Response, next: NextFunction): void => { };
```

### Create validator

The validators will be used to secure our application and be sure of the data we will receive.
These validators relate to 2 paths of the API, creating a mentor and modifying a mentor.

First of all, create the validator file under `services/src/api/validators/mentors.val.ts`

Then, we will add 2 schemas in this files to check mentors data:

* Import `Schema` from [express-validator](https://express-validator.github.io/docs/) modules

Schema is used in Typescript to know how to define a validation schema of express-validator

``` typescript
import { Schema } from 'express-validator';
```

* Create post validator handler

``` typescript
export const MentorCreate: Schema = {
    firstName: {
        in: ['body'],
        isString: { errorMessage: 'First name must be of type string' },
        exists: { errorMessage: 'First name must be defined' },
        trim: true,
        escape: true,
    },
    lastName: {
        in: ['body'],
        isString: { errorMessage: 'Last name must be of type string' },
        exists: { errorMessage: 'Last name must be defined' },
        trim: true,
        escape: true,
    },
    email: {
        in: ['body'],
        isString: { errorMessage: 'Email must be of type string' },
        isEmail: { errorMessage: 'Email must complain to email struct' },
        exists: { errorMessage: 'Email must be defined' },
        trim: true,
        escape: true,
    },
};
```

* Create update validator handler

``` typescript
export const MentorUpdate: Schema = {
    firstName: {
        in: ['body'],
        isString: { errorMessage: 'First name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    lastName: {
        in: ['body'],
        isString: { errorMessage: 'Last name must be of type string' },
        optional: true,
        trim: true,
        escape: true,
    },
    email: {
        in: ['body'],
        isString: { errorMessage: 'Email must be of type string' },
        isEmail: { errorMessage: 'Email must complain to email struct' },
        optional: true,
        trim: true,
        escape: true,
    },
};
```

Then, we need to receive and process validation errors in the controllers.
To do this, you must load the method used by the express-validator module.

Add at the head of the `mentors-ctrl.ts` file following code:

``` typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import {
    BAD_REQUEST_VALIDATOR,
} from '../helpers/global.helper';
```

* **BAD_REQUEST_VALIDATOR** is used to factorize errors handling
* **validationResult** is used to recover errors in express request

After adding import in hander, you migth add following code in:

* postMentor
* getMentor
* putMentor
* deleteMentor

``` typescript
// @see validator + router
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return BAD_REQUEST_VALIDATOR(next, errors);
}
```

You should have follwing code in your controller:

``` typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import {
    BAD_REQUEST_VALIDATOR,
} from '../helpers/global.helper';

/**
 * GET /mentors
 * Used to GET all mentors
 */
export const getMentors = (_req: Request, res: Response, next: NextFunction): void => { };

/**
 * POST /mentorss
 * Used to create a new mentor entry
 */
export const postMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }
};

/**
 * GET /mentors/:id
 * Used to select a mentor by ID
 */
export const getMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }
};

/**
 * PUT /mentors/:id
 * Used to update mentor values
 */
export const putMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }
};

/**
 * DELETE /mentors/:id
 * Used to remove a mentor from database
 */
export const deleteMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }
};
```

### Add controller implementations

Now we need to add controller implementation.
Before proceed every methods, we need to import methods that we will use:

``` typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Import mentors ORM class
import Mentors from '../../models/Mentors';
import httpStatus from 'http-status-codes';

// Factorization methods to handle errors
import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';
```

First, we need to handle methods to retrieve all mentors

``` typescript
/**
 * GET /mentors
 * Used to GET all mentors
 */
export const getMentors = (_req: Request, res: Response, next: NextFunction): void => {
    // Retrieve all mentors from database
    Mentors.findAll()
        .then((mentors) => {
            // Check if we have mentor
            if (checkArrayContent(mentors, next)) {
                // Return mentors list
                return res.send(mentors);
            }
        })
        // If we have any error, return unprocessable entity
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Then, we add methods to handle creation of mentors

``` typescript
/**
 * POST /mentors
 * Used to create a new mentor entry
 */
export const postMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Get all data, we aren't afraid of having wrong data because we validate them before
    const mentor: IMentorEntity = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };

    // Insert mentor in database
    Mentors.create(mentor)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

After this, we need to handle access to one mentor by ID

``` typescript
/**
 * GET /mentors/:id
 * Used to select a mentors by ID
 */
export const getMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    // Select mentor by ID into database
    Mentors.findByPk(req.params.id)
        .then((val) => {
            // Check if we have content, and if so return it
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Handling of mentor update

``` typescript
/**
 * PUT /mentors/:id
 * Used to update mentor values
 */
export const putMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then((mentor) => {
            if (!checkContent(mentor, next)) {
                return undefined;
            }

            if (req.body.firstName) {
                mentor.set('firstName', req.body.firstName);
            }
            if (req.body.lastName) {
                mentor.set('lastName', req.body.lastName);
            }
            if (req.body.email) {
                mentor.set('email', req.body.email);
            }

            return mentor.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};
```

And finally, we need to handle mentor remove

``` typescript
/**
 * DELETE /mentors/:id
 * Used to remove a mentor from database
 */
export const deleteMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined)) // Call destroy on selected mentor
        .then(() => res.sendStatus(httpStatus.OK)) // Return OK status
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};
```

You should have following code at the end

``` typescript
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import Mentors from '../../models/Mentors';
import httpStatus from 'http-status-codes';

import {
    UNPROCESSABLE_ENTITY,
    checkArrayContent,
    BAD_REQUEST_VALIDATOR,
    checkContent,
} from '../helpers/global.helper';

/**
 * GET /mentors
 * Used to GET all mentors
 */
export const getMentors = (_req: Request, res: Response, next: NextFunction): void => {
    Mentors.findAll()
        .then((mentors) => {
            if (checkArrayContent(mentors, next)) {
                return res.send(mentors);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * POST /mentorss
 * Used to create a new mentor entry
 */
export const postMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    const mentor: IMentorEntity = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    };

    Mentors.create(mentor)
        .then((created) => res.send(created))
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * GET /mentors/:id
 * Used to select a mentor by ID
 */
export const getMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};

/**
 * PUT /mentors/:id
 * Used to update mentor values
 */
export const putMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then((mentor) => {
            if (!checkContent(mentor, next)) {
                return undefined;
            }

            if (req.body.firstName) {
                mentor.set('firstName', req.body.firstName);
            }
            if (req.body.lastName) {
                mentor.set('lastName', req.body.lastName);
            }
            if (req.body.email) {
                mentor.set('email', req.body.email);
            }

            return mentor.save();
        })
        .then((updated) => {
            if (updated) {
                return res.send(updated);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

/**
 * DELETE /mentors/:id
 * Used to remove a mentor from database
 */
export const deleteMentor = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Mentors.findByPk(req.params.id)
        .then((val) => (val ? val.destroy() : undefined))
        .then(() => res.sendStatus(httpStatus.OK))
        .catch((e) => UNPROCESSABLE_ENTITY(e, next));
};

```

### Add routes implementations

Now, we need to add routes implementations.
Routes allow us to link every controllers and validators we previous create.

First of all, create the route files under `services/src/api/routers/mentors.route.ts`

We now link every thing as following:

``` typescript
import express from 'express';
import { checkSchema } from 'express-validator';

import * as MentorsCtrl from '../controllers/mentors.ctrl';

import { ID } from '../validators/generic.val';
import { MentorUpdate, MentorCreate } from '../validators/mentors.val';

const router = express.Router();

router.get('', MentorsCtrl.getMentors);
router.post('', checkSchema(MentorCreate), MentorsCtrl.postMentor);
router.get('/:id', checkSchema(ID), MentorsCtrl.getMentor);
router.put('/:id', checkSchema(Object.assign({}, ID, MentorUpdate)), MentorsCtrl.putMentor);
router.delete('/:id', checkSchema(ID), MentorsCtrl.deleteMentor);

export default router;
```

Then, add our new router to API routers in `services/src/api/route.ts`:

``` typescript
import express from 'express';

...
import mentorsRouter from './routers/mentors.route';
...

const router = express.Router();

...
router.use('/mentors', mentorsRouter);
...

export default router;
```

We have done. To test, run following command under `services` directory:

* npm run build
* npm run serve

### Test on postman on documentation

Now, you can go to postman and add our requests into the documentation.

[Medium tutorial to generate an API documentation in postman](https://medium.com/@olotintemitope/how-to-generate-your-api-documentation-in-20-minutes-4e0072f08b94)

You need to generate 5 requests in documentation as following:

* mentors/
  * Get all mentors (`GET /api/v1/mentors`)
  * Create a new metnors (`POST /api/v1/mentors`)
  * Get a mentor by ID (`GET /api/v1/mentors/:id`)
  * Update a mentor (`UPDATE /api/v1/mentors/:id`)
  * Remove a mentor (`DELETE /api/v1/mentors/:id`)

If you need sample, look at businesses documentation.

### Conclusion of this part

To summarize, we created in this part of the tutorial:

* 5 controllers to handle routes
* 2 validators to handle create and update structure validation
* 5 routes in the express server
* the documentation of our new data

## Visualize data in front-end

We have previously setup routes to handle `mentors` data in the API, but we now need to be able to acces this data in the front-end part.
To do so, we will:

* Create mentor interface into `app/src/api/types.d.ts`
* Add an API interfaces under the `app/src/api/` directory
* Add a view to show mentors list under the `app/src/views/` directory

### Create mentor interfaces

Create mentor interfaces for typescript under `app/src/api/types.d.ts` files

``` typescript
export declare interface IMentor {
  id?: number;

  firstName: string;
  lastName: string;
  email: string;

  createdAt?: string;
  updatedAt?: string;
}
```

### Add API in front-end code

We will not detail this part of tutoriel because register routes into front-end is quit simple using `request` method available in `app/src/utils`.

Create the api file under `app/src/api/`

``` typescript
import request from '@/utils/request';
import { IMentor } from './types';

export const defaultMentorData: IMentor = {
  firstName: '',
  lastName: '',
  email: '',
};

export const getMentores = () =>
  request({
    url: '/mentors',
    method: 'get',
  });

export const getMentor = (id: number, params: any) =>
  request({
    url: `/mentors/${id}`,
    method: 'get',
    params,
  });

export const createMentor = (data: any) =>
  request({
    url: '/mentors',
    method: 'post',
    data,
  });

export const updateMentor = (id: number, data: any) =>
  request({
    url: `/mentors/${id}`,
    method: 'put',
    data,
  });

export const deleteMentor = (id: number) =>
  request({
    url: `/mentors/${id}`,
    method: 'delete',
  });
```

### Create the view

This is the most import path to render our data.

First of all, create `mentors` directory under `app/src/views` and add `index.vue`

The default struct of a view component is:

``` typescript
<template>
  <div class="app-container">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Mentors',
})
export default class extends Vue {
}
</script>
```

### Add table to our view

We know want to add a table with our data

``` typescript
<template>
  <div class="app-container">
    <!-- Table -->
    <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border fit
        highlight-current-row
        style="width: 100%;"
    >
      <el-table-column :label="$t('table.mentors.firstName')" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentors.lastName')" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentors.email')" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="330"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';
import {
  getMentors,
} from '../../api/mentors';
import { IMentor } from '../../api/types';
import Pagination from '../../components/Pagination/index.vue';

@Component({
  name: 'Mentors',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IMentor[] = [];
  private total = 0;
  private listLoading = true;

  // Filter for query, this will not be used until we add pagination
  private listQuery = {
    page: 1,
    limit: 10,
    title: undefined,
  };
  private dialogFormVisible = false;
  private dialogStatus = '';

  public created() {
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getMentors().then(data => {
      this.list = data;
      this.total = data.length;
      this.listLoading = false;
    });
  }
}
</script>
```

In this code, we do a lot of thing:

On template, we can read that we delare a table and 4 tables columns. The actions colums is used to let user done some actions in this line. We will see how to use the `update` button later.

You can see a lot of sing in this code:

* *$t('table.mentors.firstName')* is a reference in the translation array under `app/src/lang/` directory.
* *pagination* is a component create to help us in pagination

We also have declare a lot of new var in `script` balise, thoses variables are availabe in the component using *this.varName* or in *varName* in the `template` balise

### Add edition, filter and excel export

I will know give you the code to handle update and filter in the mentors views.
Take time and search in [vuejs] documentation to well understand every thing in this code. It will be usefull for next steps.

``` typescript
<template>
  <div class="app-container">
    <!-- Filter -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.mentors.name')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        style="margin-left: 10px;"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('table.export') }}
      </el-button>
    </div>

    <!-- Table -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.mentors.firstName')" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentors.lastName')" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.mentors.email')" min-width="150px" >
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="330"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempMentorData"
        label-position="left"
        label-width="250px"
        style="width: 100%; padding: 0 50px;"
      >
        <el-form-item :label="$t('table.mentors.firstName')" prop="firstName" >
          <el-input v-model="tempMentorData.firstName" />
        </el-form-item>
        <el-form-item :label="$t('table.mentors.lastName')" prop="lastName" >
          <el-input v-model="tempMentorData.lastName" />
        </el-form-item>
        <el-form-item :label="$t('table.mentors.email')" prop="email" >
          <el-input v-model="tempMentorData.email" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Form } from 'element-ui';
import { cloneDeep } from 'lodash';
import {
  getMentors,
  createMentor,
  updateMentor,
  defaultMentorData,
} from '../../api/mentors';
import { IMentor } from '../../api/types';
import { exportJson2Excel } from '../../utils/excel';
import { formatJson } from '../../utils';
import Pagination from '../../components/Pagination/index.vue';

@Component({
  name: 'Mentors',
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: IMentor[] = [];
  private total = 0;
  private listLoading = true;

  // Filter for query, this will not be used until we add pagination
  private listQuery = {
    page: 1,
    limit: 10,
    title: undefined,
  };
  private dialogFormVisible = false;
  private dialogStatus = '';

  // Available mode to print in edition dialog
  private textMap = {
    update: 'Edit',
    create: 'Create',
  };

  // Validation rules for edit and update
  private rules = {
    firstName: [{ required: true, message: 'First name is required', trigger: 'change' }],
    lastName: [{ required: true, message: 'Last name is required', trigger: 'change' }],
    email: [{ required: true, message: 'Email is required', trigger: 'change' }],
  };
  private downloadLoading = false;
  private tempMentorData = defaultMentorData;

  public created() {
    this.getList();
  }

  private getList() {
    this.listLoading = true;
    getMentors().then(data => {
      this.list = data;
      this.total = data.length;
      this.listLoading = false;
    });
  }

  private handleFilter() {
    this.getList();
  }

  private resetTempMentorData() {
    this.tempMentorData = cloneDeep(defaultMentorData);
  }

  private handleCreate() {
    this.resetTempMentorData();
    this.dialogStatus = 'create';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const data = await createMentor(this.tempMentorData);
        this.list.unshift(data);
        this.dialogFormVisible = false;
        this.$notify({
          title: 'Mentor creation',
          message: 'Mentor successfully created',
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleUpdate(row: any) {
    this.tempMentorData = Object.assign({}, row);
    this.dialogStatus = 'update';
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate();
    });
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const tempData = Object.assign({}, this.tempMentorData);
        const { data } = await updateMentor(tempData.id!, tempData);
        for (const v of this.list) {
          if (v.id === data.article.id) {
            const index = this.list.indexOf(v);
            this.list.splice(index, 1, data.article);
            break;
          }
        }
        this.dialogFormVisible = false;
        this.$notify({
          title: 'Update a mentor',
          message: 'Successfully update mentor data',
          type: 'success',
          duration: 2000,
        });
      }
    });
  }

  private handleDownload() {
    this.downloadLoading = true;
    const tHeader = [
      'firstName',
      'lastName',
      'email',
    ];
    const filterVal = [
      'firstName',
      'lastName',
      'email',
    ];
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, 'table-list');
    this.downloadLoading = false;
  }
}
</script>
```

### Register our view in the router

Go to the `app/src/router/index.ts` file to do so.

``` typescript
  {
    path: '/mentors',
    component: Layout,
    children: [
      {
        path: 'mentors',
        component: () =>
          import(
            /* webpackChunkName: "mentors" */ '@/views/mentors/index.vue'
          ),
        name: 'Mentors',
        meta: { title: 'mentors', icon: 'shopping', affix: true },
      },
    ],
  },
```

### TODO list

To be sure you well understand how internationalization, you might done following things to increase table quality:

* Change header in `handleDownload` to load internationalized headers.
* Change file name in `handleDownload` to load internationalized file name. (use slugify name for file)
* Change notification in `updateData` to load internationalized notification.
* Change notification in `createData` to load internationalized notification.
* Change `rules` to load internationalized errors message.

## Manage pagination

Managing paging may seem trivial at first when an application needs to manage thirty or so mentors, but it becomes essential when it comes to having a very dynamic application that allows the user to manage very large samples.

As you may have noticed, we have already planned the pagination in the code of the step 'Visualize data in front-end', and we need to have it to the back-end.

To do this, we will:

* Create a new validation schema to receive and secure our pagination filter
* Edit mentor's route to use this validation schema
* Modify the mentor controller to use these filters
* Update the front-end API to send params.

To handle pagination, we will use 2 params:

* The page number to know which page we need
* The limit to know how many entry we need to select

This pagination is apply to the `GET /api/v1/mentors` routes.

### Create the new validator

Under validator directory `services/src/api/validators/mentors.val.ts`, we need to create a new schema

``` typescript
export const MentorList: Schema = {
  page: {
    in: ['query'],
    isInt: { errorMessage: 'Page need to be an integer' },
    optional: true,
    toInt: true,
  },
  limit: {
    in: ['query'],
    isInt: { errorMessage: 'Limit need to be an integer' },
    optional: true,
    toInt: true,
  },
};
```

### Change mentors routes

We now need to add this validators to our mentors routes in `services/src/api/routers`.

``` typescript
import express from 'express';
import { checkSchema } from 'express-validator';

import * as MentorsCtrl from '../controllers/mentors.ctrl';

import { ID } from '../validators/generic.val';
import { MentorUpdate, MentorCreate, MentorList } from '../validators/mentors.val';

const router = express.Router();

router.get('', checkSchema(MentorList), MentorsCtrl.getMentors);
router.post('', checkSchema(MentorCreate), MentorsCtrl.postMentor);
router.get('/:id', checkSchema(ID), MentorsCtrl.getMentor);
router.put('/:id', checkSchema(Object.assign({}, ID, MentorUpdate)), MentorsCtrl.putMentor);
router.delete('/:id', checkSchema(ID), MentorsCtrl.deleteMentor);

export default router;
```

### Update mentor controller

We have 2 things to do:

* Change Sequelize query to get only part of entries
* Change handler response to let our user know the pagination status

First, get the pagination parameters and apply them to the ORM queries.
We will use a wrapper to do this to factorize this treatment.

This wrapper is a function available under `services/src/api/helpers/pagination.helper.ts`
Don't forget to import him to be able to use it.

``` typescript
/**
 * GET /mentors
 * Used to GET all mentors
 */
export const getMentors = (req: Request, res: Response, next: NextFunction): void => {
  // @see validator + router
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return BAD_REQUEST_VALIDATOR(next, errors);
  }
  
  // Retrive query data
  const { page = 1, limit = 20 } = req.query;
  Mentors.findAll(paginate({ page, limit }))
      .then((mentors) => {
          if (checkArrayContent(mentors, next)) {
              return res.send(mentors);
          }
      })
      .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Then, change the format of the response to inform users about the page and the number of data in the response.

``` typescript
/**
 * GET /mentors
 * Used to GET all mentors
 */
export const getMentors = (req: Request, res: Response, next: NextFunction): void => {
  // @see validator + router
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return BAD_REQUEST_VALIDATOR(next, errors);
  }

  // Retrive query data
  const { page = 1, limit = 20 } = req.query;
  let max: number;

  Mentors.count()
    .then((rowNbr) => {
      max = rowNbr;
      return Mentors.findAll(paginate({ page, limit }));
    })
    .then((mentors) => {
      if (checkArrayContent(mentors, next)) {
        return res.send({
            page,
            data: mentors,
            length: mentors.length,
            max,
        });
      }
    })
    .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Everything is ready in the back-end part for our pagination.

You may now need to:

* Edit the front-end mentors API `app/src/api/mentors.ts` to send query params
* Edit the front-end views `app/src/views/mentors/index.ts` to receive data using the new request format
* Update Postman documentation query and response.

## Publish modifications

* [Commit your changes](https://support.gitkraken.com/working-with-commits/commits/)
* [Publish your branch](https://support.gitkraken.com/working-with-repositories/pushing-and-pulling/)
* [Create a pull request](https://help.github.com/en/articles/creating-a-pull-request)

## Code review

[Github presentation](https://github.com/features/code-review/)
