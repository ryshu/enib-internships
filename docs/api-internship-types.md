---
id: api-internship-types
title: InternshipTypes
---

Details of routes to handle **internshipTypes**

## List of all internship types

``` sh
GET /api/v1/internshipTypes
```

### 200 - List of internship types

``` json
[{
    "id": 1,
    "label": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}]
```

### 204 - Not content

If the API doesn't have any internship in his database, we return a status **204 - No content**

## Create a new internship

``` sh
POST /api/v1/internshipTypes
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**label** | String | *no* | Internship label

### 200 - Created

Return created internship

``` json
{
    "id": 1,
    "label": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
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
      "msg": "Label must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Label must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a internship type by ID

``` sh
GET /api/v1/internshipTypes/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Internship type

``` json
{
    "id": 1,
    "label": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

### 204 - No content

If the API doesn't have any internship type in his database, we return a status **204 - No content**

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

## Update a internship type by ID

``` sh
PUT /api/v1/internshipTypes/:id
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

Key | Type | Optional | Description
- | - | - | -
**label** | String | *yes* | Internship label

### 200 - Updated internship type

``` json
{
    "id": 1,
    "label": "Sed quaerat culpa saepe fuga velit distinctio ea deleniti.",
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

### 204 - No content

If the API doesn't have any internship type in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Label must be of type string",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a internship type by ID

``` sh
DELETE /api/v1/internshipTypes/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship ID

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any internship type in his database, we return a status **204 - No content**

## Get internships related to a category by giving his ID

``` sh
GET /api/v1/internshipTypes/:id/internships
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | InternshipType ID

### 200 - Internships list

``` json
[
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
]
```

### 204 - No content

If the API doesn't have any category linked to given ID in his database, we return a status **204 - No content**

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

## Link internship to category

``` sh
GET /api/v1/internshipTypes/:id/internships/:internship_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | InternshipType ID
**internship_id** | String | Internship ID

### 200 - OK

Ok appears on two occasions

* If entries have been linked
* If internship haven't been found

``` json
OK
```

### 204 - No content

If the API doesn't have any category linked to given ID in his database, we return a status **204 - No content**

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
