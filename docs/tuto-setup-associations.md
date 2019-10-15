---
id: tuto-setup-associations
title: Setup associations
---

In this tutorial, will see every step to set up an association between two entity.
We took the example of the relation One-To-Many between Businesses and Internships.
In the end, we will be able to:

* Setup a link One-To-Many
* List internships related to a business
* Get the business related to an internships

## The One-To-Many relation

One-To-Many associations are connecting one source with multiple targets. The targets however are again connected to exactly one specific source.
In our sample, we want to connect one **Businesses** to multiple **Internships**

To get more detail about oneToMany, you can reach this url:

* [Sequalize - One to Many](https://sequelize.org/master/manual/associations.html#one-to-many-associations--hasmany-)
* [wikipedia](https://en.wikipedia.org/wiki/One-to-many_(data_model))

## Add relation between Businesses and Internships

The first thing we need to do is declare to our ORM that we want to set up the relation between **Businesses** and **Internships**

To do so, go to `services/src/configs/setup/database.ts` and add the following code:

``` typescript
Businesses.hasMany(Internships, { as: 'internships', foreignKey: 'businessId', sourceKey: 'id' });
Internships.belongsTo(Businesses, { as: 'business', foreignKey: 'businessId', targetKey: 'id' });
```

This can be translated as follows:

* We declare that **Businesses** has many **Internships**, which will be available on **internships** fields using **businessId** in the Internships table and the relation will be base on **Business.id**
* We declare that **Internships** belongs to **Businesses**, which will be available on **business** fields using **businessId** in the Internships table and the relation which refering on **Business.id**

Then, we need to get declarations of all methods that will be created by *Sequelize* for us.

Go to `servcices/src/models/Businesses.ts` and add the following code:

``` typescript
class Businesses extends Sequelize.Model implements IBusinessEntity {
    public static associations: {
        business: Sequelize.Association<Businesses, Internships>;
    };

    ...

    public getInternships: Sequelize.HasManyGetAssociationsMixin<Internships>;
    public addInternship: Sequelize.HasManyAddAssociationMixin<Internships, Internships['id']>;
    public createInternship: Sequelize.HasManyCreateAssociationMixin<IInternshipEntity>;
    public hasInternship: Sequelize.HasManyHasAssociationMixin<Internships, Internships['id']>;
    public countInternships: Sequelize.HasManyCountAssociationsMixin;

    public readonly internships?: Internships[];
    public internshipCount: number;
}
```

Also, go to `services/src/models/Internships.ts` and add the following code:

``` typescript
class Internships extends Sequelize.Model implements IInternshipEntity {
    public static associations: {
        business: Sequelize.Association<Internships, Businesses>;
    };

    ...

    public getBusiness: Sequelize.BelongsToGetAssociationMixin<Businesses>;
    public setBusiness: Sequelize.BelongsToSetAssociationMixin<Businesses, Businesses['id']>;
    public createBusiness: Sequelize.BelongsToCreateAssociationMixin<IBusinessEntity>;

    public readonly business?: Businesses | Businesses['id'];
}

Internships.init(
    {
        ...
    },
    {
        ...
        defaultScope: {
            attributes: { exclude: ['businessId'] },
        },
    },
);
```

Here we also add excluded attributes in default scope, **businessId**. We do this to prevent businessId to appear in internships entries.
For our ORM, all is done. We have created in database our association.

You now need to update your database.

* go to `services/.env` files and set **"ORM_DROP_DB_ON_START"** to true
* run your serve builded `npm run build` and `npm run serve`
* go to `services/.env` files and set **"ORM_DROP_DB_ON_START"** to false

## Update businesses router

We now need to let our user access those relations in api.

For our case, in businesses router, we only need to set up 2 routes:

* GET /businesses/:id/internships (get list of internships linked to a business)
* POST /businesses/:id/internships/:internship_id/link (add new relation between business and internships)

First, we want to get a list of all available internships.

### Controllers

Go to `services/src/api/controllers/businesses.ctrl.ts`

We add the get controller

``` typescript
/**
 * GET /businesses/:id/internships
 * Used to get all internships of a business
 */
export const getBusinessInternships = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Businesses.findByPk(req.params.id, { include: [{ model: Internships, as: 'internships' }] })
        .then(async (val) => {
            if (checkContent(val, next)) {
                return res.send(val.internships);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Then the post controller

``` typescript
/**
 * GET /businesses/:id/internships/:internship_id/link
 * Used to get all internships of a business
 */
export const linkBusinessInternships = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Businesses.findByPk(req.params.id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                await val.addInternship(Number(req.params.internship_id));
                return res.sendStatus(httpStatus.OK);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Don't forget to update your import to include **Internships** database access.

We also want to improve our *GET /buisnesses/:id* endpoint. To do so, we include internships in find query as following

``` typescript
/**
 * GET /businesses/:id
 * Used to select a business by ID
 */
export const getBusiness = (req: Request, res: Response, next: NextFunction): void => {
    ...

    Businesses.findByPk(req.params.id, { include: [{ model: Internships, as: 'internships' }] })
        ...
};
```

### Validators

The only validator that we need to create is in `services/src/api/validators/generic.val.ts` and add the declaration of **InternshipID** validator

``` typescript
export const InternshipID: Schema = namedID('internship_id', 'Internship identifier');
```

Named ID is used to factorize ID validator declaration.

### Router

Last thing to do on API is to update the `services/src/api/router/businesses.router.ts`.

Add the following code in your router:

``` typescript
...

router.get('/:id/internships', checkSchema(ID), BusinessesCtrl.getBusinessInternships);
router.post(
    '/:id/internships/:internship_id/link',
    checkSchema(Object.assign({}, ID, InternshipID)),
    BusinessesCtrl.linkBusinessInternships,
);

export default router;
```

## Update internship router

We now need to let our user access those relations in api.

For our case, in internships router, we only need to set up 2 routes:

* GET /internships/:id/businesses (get list of businesses linked to an internship)
* POST /internships/:id/businesses/:internship_id/link (add new relation between business and internships)

First, we want to get a list of all available internships.

### Controller

Go to `services/src/api/controllers/internships.ctrl.ts`

We add the get controller

``` typescript
/**
 * GET /internship/:id/business
 * Used to select a internship by ID and return his business
 */
export const getInternshipBusiness = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Internships.findByPk(req.params.id, { include: [{ model: Businesses, as: 'business' }] })
        .then((val) => {
            if (checkContent(val, next)) {
                return res.send(val.business);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Then the post controller

``` typescript
/**
 * POST /internships/:id/business/:business_id/link
 * Used to get all internships of a business
 */
export const linkInternshipBusinesses = (req: Request, res: Response, next: NextFunction): void => {
    // @see validator + router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return BAD_REQUEST_VALIDATOR(next, errors);
    }

    Businesses.findByPk(req.params.business_id)
        .then(async (val) => {
            if (checkContent(val, next)) {
                await val.addInternship(Number(req.params.id));
                return res.sendStatus(httpStatus.OK);
            }
        })
        .catch((e) => UNPROCESSABLE_ENTITY(next, e));
};
```

Don't forget to update your import to include **Businesses** database access.

We also want to improve our *GET /internships/:id* endpoint. To do so, we include businesses to find query as following

``` typescript
/**
 * GET /internship/:id
 * Used to select a internship by ID
 */
export const getInternship = (req: Request, res: Response, next: NextFunction): void => {
    ...

    Internships.findByPk(req.params.id, { include: [{ model: Businesses, as: 'business' }] })
        ...
};
```

### Validator

The only validator that we need to create is in `services/src/api/validators/generic.val.ts` and add the declaration of **BusinessID** validator

``` typescript
export const BusinessID: Schema = namedID('business_id', 'Business identifier');
```

### Router

Last thing to do on API is to update the `services/src/api/router/internships.router.ts`.

Add the following code in your router:

``` typescript
...

router.get('/:id/businesses', checkSchema(ID), InternshipsCtrl.getInternshipBusinesses);
router.post(
    '/:id/businesses/:businesse_id/link',
    checkSchema(Object.assign({}, ID, BusinessID)),
    InternshipsCtrl.linkInternshipBusinesses,
);

export default router;
```

## For futher

* Update tests link to linked entities (if error on fixtures, `npm run test -- -u` will update them)
* Update api documentation of both linked entities
