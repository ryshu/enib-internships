---
id: api-students
title: Students
---

Details of routes to handle **students**

## List of all students

``` sh
GET /api/v1/students
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - List of students

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
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

If the API doesn't have any student in his database, we return a status **204 - No content**

## Create a new student

``` sh
POST /api/v1/students
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**firstName** | String | *no* | Student firstName
**lastName** | String | *no* | Student lastName
**email** | String | *no* | Student email
**semester** | String | *no* | Student semester

### 200 - Created

Return created student

``` json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@enib.fr",
  "semester": "S8",
  "updatedAt": "2019-09-19T22:21:24.365Z",
  "createdAt": "2019-09-19T22:21:24.365Z"
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
      "msg": "First name must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "First name must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a student by ID

``` sh
GET /api/v1/students/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student ID

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

If the API doesn't have any student in his database, we return a status **204 - No content**

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

## Update a student by ID

``` sh
PUT /api/v1/students/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student ID

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**firstName** | String | *yes* | Student firstName
**lastName** | String | *yes* | Student lastName
**email** | String | *yes* | Student email
**semester** | String | *yes* | Student semester

### 200 - Updated student

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

If the API doesn't have any student in his database, we return a status **204 - No content**

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
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a student by ID

``` sh
DELETE /api/v1/students/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student ID

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any student in his database, we return a status **204 - No content**

## Get internships related to a student by giving his ID

``` sh
GET /api/v1/students/:id/internships
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student ID

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - Internships list

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
            "isProposition": true,
            "isPublish": false,
            "publishAt": "2019-10-13T16:21:25.000Z",
            "createdAt": "2019-10-13T16:21:25.000Z",
            "updatedAt": "2019-10-13T16:21:25.000Z"
        },
    ],
    "length": 1,
    "max": 1
}
```

### 204 - No content

If the API doesn't have any student in his database, we return a status **204 - No content**

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

## Link student to internship

``` sh
GET /api/v1/students/:id/internships/:internship_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student ID
**internship_id** | String | Internship ID

### 200 - OK

Ok appears on two occasions

* If entries have been linked
* If internship haven't been found

``` json
OK
```

### 204 - No content

If the API doesn't have any student in his database, we return a status **204 - No content**

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
