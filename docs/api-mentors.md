---
id: api-mentors
title: Mentors
---

Details of routes to handle **mentors**

## List of all mentors

``` sh
GET /api/v1/mentors
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - List of mentors

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "role": "default",
            "email": "john.doe@enib.fr",
            "semester": "S8",
            "createdAt": "2019-09-30T11:24:50.000Z",
            "updatedAt": "2019-09-30T11:24:50.000Z"
        },
    ],
    "length": 1,
    "max": 1
}
```

### 204 - Not content

If the API doesn't have any mentors in his database, we return a status **204 - No content**

## Create a new mentor

``` sh
POST /api/v1/mentors
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**firstName** | String | *no* | Mentor firstName
**lastName** | String | *no* | Mentor lastName
**role** | String | *no* | Mentor role
**email** | String | *no* | Mentor email
**semester** | String | *no* | Mentor semester

### 200 - Created

Return created mentor

``` json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "role": "default",
    "email": "john.doe@enib.fr",
    "semester": "S8",
    "createdAt": "2019-09-30T11:24:50.000Z",
    "updatedAt": "2019-09-30T11:24:50.000Z"
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
      "msg": "Email must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Email must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a mentor by ID

``` sh
GET /api/v1/mentors/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentor ID

### 200 - Mentor

``` json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "role": "default",
    "email": "john.doe@enib.fr",
    "semester": "S8",
    "createdAt": "2019-09-30T11:24:50.000Z",
    "updatedAt": "2019-09-30T11:24:50.000Z"
}
```

### 204 - No content

If the API doesn't have any mentor in his database, we return a status **204 - No content**

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

## Update a mentor by ID

``` sh
PUT /api/v1/mentors/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentor ID

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**firstName** | String | *no* | Mentor firstName
**lastName** | String | *no* | Mentor lastName
**role** | String | *no* | Mentor role
**email** | String | *no* | Mentor email
**semester** | String | *no* | Mentor semester

### 200 - Updated mentor

``` json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "role": "default",
    "email": "john.doe@enib.fr",
    "semester": "S8",
    "createdAt": "2019-09-30T11:24:50.000Z",
    "updatedAt": "2019-09-30T11:24:50.000Z"
}
```

### 204 - No content

If the API doesn't have any mentor in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Role must be of type string",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a mentor by ID

``` sh
DELETE /api/v1/mentors/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentor ID

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any mentor in his database, we return a status **204 - No content**

## Get campaign related to a mentor by giving his ID

``` sh
GET /api/v1/mentors/:id/campaigns
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentor ID

### 200 - Campaigns list

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
  "startAt": 0,
  "endAt": 0,
  "updatedAt": "2019-09-19T22:21:24.365Z",
  "createdAt": "2019-09-19T22:21:24.365Z"
},
```

### 204 - No content

If the API doesn't have any mentor in database link to given ID, we return a status **204 - No content**

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

## Link campaign to mentor

``` sh
GET /api/v1/mentors/:id/campaigns/:campaign_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentor ID
**campaign_id** | String | Campaign ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have requested campaign or mentor in his database, we return a status **204 - No content**

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
