---
id: api-internships
title: Internships
---

Details of routes to handle **internships**

## List of all internships

``` sh
GET /api/v1/internships
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)
**contries** | String[] | *no* | List of reached countries
**types** | Number[] | *no* | List of reached types
**subject** | String | *no* | Part of subject to filter in database
**mode** | String | *no* | published or propositions or self
**isAbroad** | Number | *no* | Filter to get only abroad internships
**isValidated** | Number | *no* | Filter to get only validated internships

### 200 - List of internships

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "subject": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
            "description": "Atque officia consectetur. Eum molestiae rerum qui et. Nostrum fuga molestiae voluptate. Eius omnis nihil non eveniet sed ut. Voluptate provident et voluptate provident illo voluptatem enim ea et. Voluptatem qui reiciendis molestiae rerum blanditiis rem. Ut qui dolor nostrum consequatur accusantium ex esse mollitia atque.",
            "country": "Russian Federation",
            "city": "New Rocky",
            "postalCode": "30636-9003",
            "address": "15486 Genoveva Isle",
            "additional": "Suite 755",
            "isInternshipAbroad": false,
            "isValidated": false,
            "createdAt": "2019-10-13T16:21:25.000Z",
            "updatedAt": "2019-10-13T16:21:25.000Z"
        },
    ],
    "length": 1,
    "max": 1
}
```

### 204 - Not content

If the API doesn't have any internship in his database, we return a status **204 - No content**

## Create a new internship

``` sh
POST /api/v1/internships
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description | Access
- | - | - | - | -
**subject** | String | *no* | Internship subject | *
**description** | String | *no* | Internship description | *
**category** | String | *no* | Internship category | *
**country** | String | *no* | Internship country | *
**city** | String | *no* | Internship city | *
**postalCode** | String | *no* | Internship postalCode | *
**address** | String | *no* | Internship address | *
**additional** | String | *no* | Address additional detail | *
**isInternshipAbroad** | Boolean | *yes* | Internship is abroad | *
**isValidated** | Boolean | *yes* | Internship is validated | admin
**isPublish** | Boolean | *yes* | Internship is publish | admin
**isProposition** | Boolean | *yes* | Internship is proposition
**startAt** | Number(timestamp) | *yes* | Internship start at | *
**endAt** | Number(timestamp) | *yes* | Internship end at | *
**publishAt** | Number(timestamp) | *yes* | Internship publish at | admin

### 200 - Created

Return created internship

``` json
{
    "id": 1,
    "subject": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "description": "Atque officia consectetur. Eum molestiae rerum qui et. Nostrum fuga molestiae voluptate. Eius omnis nihil non eveniet sed ut. Voluptate provident et voluptate provident illo voluptatem enim ea et. Voluptatem qui reiciendis molestiae rerum blanditiis rem. Ut qui dolor nostrum consequatur accusantium ex esse mollitia atque.",
    "country": "Russian Federation",
    "city": "New Rocky",
    "postalCode": "30636-9003",
    "address": "15486 Genoveva Isle",
    "additional": "Suite 755",
    "isInternshipAbroad": false,
    "isValidated": false,
    "isProposition": true,
    "isPublish": false,
    "publishAt": "2019-10-13T16:21:25.000Z",
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Subject must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Subject must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a internship by ID

``` sh
GET /api/v1/internships/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Internship

``` json
{
    "id": 1,
    "subject": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "description": "Atque officia consectetur. Eum molestiae rerum qui et. Nostrum fuga molestiae voluptate. Eius omnis nihil non eveniet sed ut. Voluptate provident et voluptate provident illo voluptatem enim ea et. Voluptatem qui reiciendis molestiae rerum blanditiis rem. Ut qui dolor nostrum consequatur accusantium ex esse mollitia atque.",
    "country": "Russian Federation",
    "city": "New Rocky",
    "business": null,
    "category": null,
    "postalCode": "30636-9003",
    "address": "15486 Genoveva Isle",
    "additional": "Suite 755",
    "isInternshipAbroad": false,
    "isValidated": false,
    "isProposition": true,
    "isPublish": false,
    "publishAt": "2019-10-13T16:21:25.000Z",
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

### 204 - No content

If the API doesn't have any internship in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Update a internship by ID

``` sh
PUT /api/v1/internships/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description | Access
- | - | - | - | -
**subject** | String | *yes* | Internship subject | *
**description** | String | *yes* | Internship description | *
**category** | String | *yes* | Internship category | *
**country** | String | *yes* | Internship country | *
**city** | String | *yes* | Internship city | *
**postalCode** | String | *yes* | Internship postalCode | *
**address** | String | *yes* | Internship address | *
**additional** | String | *yes* | Address additional detail | *
**isInternshipAbroad** | Boolean | *yes* | Internship is abroad | *
**isValidated** | Boolean | *yes* | Internship is validated | admin
**isPublish** | Boolean | *yes* | Internship is publish | admin
**isProposition** | Boolean | *yes* | Internship is proposition | admin
**startAt** | Number(timestamp) | *yes* | Internship start at | *
**endAt** | Number(timestamp) | *yes* | Internship end at | *
**publishAt** | Number(timestamp) | *yes* | Internship publish at | admin

### 200 - Updated internship

``` json
{
    "id": 1,
    "subject": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "description": "Atque officia consectetur. Eum molestiae rerum qui et. Nostrum fuga molestiae voluptate. Eius omnis nihil non eveniet sed ut. Voluptate provident et voluptate provident illo voluptatem enim ea et. Voluptatem qui reiciendis molestiae rerum blanditiis rem. Ut qui dolor nostrum consequatur accusantium ex esse mollitia atque.",
    "country": "Russian Federation",
    "city": "New Rocky",
    "postalCode": "30636-9003",
    "address": "15486 Genoveva Isle",
    "additional": "Suite 755",
    "isInternshipAbroad": false,
    "isValidated": false,
    "isProposition": true,
    "isPublish": false,
    "publishAt": "2019-10-13T16:21:25.000Z",
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

### 204 - No content

If the API doesn't have any internship in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Subject must be of type string",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a internship by ID

``` sh
DELETE /api/v1/internships/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any internship in his database, we return a status **204 - No content**

## Get businesses related to an internship by giving his ID

``` sh
GET /api/v1/internships/:id/businesses
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Business

If a business is linked to given internship, return this struct

``` json
{
  "id": 1,
  "name": "Thales Group",
  "country": "France",
  "city": "Courbevoie",
  "postalCode": "92400",
  "address": "31 Place des Corolles",
  "updatedAt": "2019-09-19T22:21:24.365Z",
  "createdAt": "2019-09-19T22:21:24.365Z"
},
```

If not any business is linked to given internship, return this struct

``` json
{}
```

### 204 - No content

If the API doesn't have any internship in database link to given ID, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Link business to internship

``` sh
GET /api/v1/internships/:id/businesses/:business_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID
**business_id** | String | Business ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have requested business or internship in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get category related to an internship by giving his ID

``` sh
GET /api/v1/internships/:id/internshipTypes
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Category

If a internshipType is linked to given internship, return this struct

``` json
{
  "id": 1,
  "label": "Thales Group",
  "updatedAt": "2019-09-19T22:21:24.365Z",
  "createdAt": "2019-09-19T22:21:24.365Z"
},
```

If not any internshipType is linked to given internship, return this struct

``` json
{}
```

### 204 - No content

If the API doesn't have any internship in his database link to given ID, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Link category to internship

``` sh
GET /api/v1/internships/:id/internshipTypes/:internship_type_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID
**internship_type_id** | String | InternshipType ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have any internshipType in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get files related to an internship by giving his ID

``` sh
GET /api/v1/internships/:id/files
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - Files list

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "name": "Human Directives Administrator",
            "size": 13583,
            "type": "png",
            "path": "http://maxine.biz",
            "createdAt": "2019-10-13T16:24:13.000Z",
            "updatedAt": "2019-10-13T16:24:13.000Z"
        },
    ],
    "length": 1,
    "max": 1
}
```

### 204 - No content

If the API doesn't have any internship in his database link to given ID, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Link file to internship

``` sh
GET /api/v1/internships/:id/files/:file_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID
**file_id** | String | File ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get campaign related to an available internship by giving his ID

``` sh
GET /api/v1/internships/:id/availableCampaigns
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Campaign

``` json
{
    "id": 1,
    "name": "test",
    "maxProposition": 2,
    "description": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "category": {
      "id": 1,
      "label": "Stage ouvrier"
    },
    "semester": "S5",
    "isPublish": false,
    "startAt": 0,
    "endAt": 0,
    "updatedAt": "2019-09-19T22:21:24.365Z",
    "createdAt": "2019-09-19T22:21:24.365Z"
}
```

### 204 - No content

If the API doesn't have any internship in his database link to given ID, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Link campaign to an available internship

``` sh
GET /api/v1/internships/:id/availableCampaigns/:campaign_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID
**campaign_id** | String | Campaign ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get campaign related to a validated internship by giving his ID

``` sh
GET /api/v1/internships/:id/validatedCampaigns
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Campaign

``` json
{
    "id": 1,
    "name": "test",
    "maxProposition": 2,
    "description": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "category": {
      "id": 1,
      "label": "Stage ouvrier"
    },
    "semester": "S5",
    "isPublish": false,
    "startAt": 0,
    "endAt": 0,
    "updatedAt": "2019-09-19T22:21:24.365Z",
    "createdAt": "2019-09-19T22:21:24.365Z"
}
```

### 204 - No content

If the API doesn't have any internship in his database link to given ID, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Link campaign to a validated internship

``` sh
GET /api/v1/internships/:id/validatedCampaigns/:campaign_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID
**campaign_id** | String | Campaign ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get student related to an internship by giving his ID

``` sh
GET /api/v1/internships/:id/students
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Student

``` json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@enib.fr",
    "semester": "S8",
    "createdAt": "2019-09-30T11:24:50.000Z",
    "updatedAt": "2019-09-30T11:24:50.000Z"
}
```

### 204 - No content

If the API doesn't have any internship in his database link to given ID, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Link student to an internship

``` sh
GET /api/v1/internships/:id/students/:student_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID
**student_id** | String | Student ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Identifier must be an integer",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Identifier must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```
