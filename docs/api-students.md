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
**name** | String | *no* | Student name
**country** | String | *no* | Student country
**city** | String | *no* | Student city
**postalCode** | String | *no* | Student postalCode
**address** | String | *no* | Student address
**additional** | String | *yes* | Address additional detail

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

## Get a student by identifier

``` sh
GET /api/v1/students/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student identifier

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

## Update a student by identifier

``` sh
PUT /api/v1/students/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student identifier

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *yes* | Student name
**country** | String | *yes* | Student country
**city** | String | *yes* | Student city
**postalCode** | String | *yes* | Student postalCode
**address** | String | *yes* | Student address
**additional** | String | *yes* | Address additional detail

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

## Remove a student by identifier

``` sh
DELETE /api/v1/students/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Student identifier

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any student in his database, we return a status **204 - No content**
