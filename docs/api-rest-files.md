---
id: api-files
title: Files
---

Details of routes to handle **files**

## List of all files

``` sh
GET /api/v1/files
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)
**archived** | Boolean | *yes* | Only archived documents

### 200 - List of files

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "name": "Human Directives Administrator",
            "size": 13583,
            "type": "int-desc",
            "path": "file_name.pdf",
            "createdAt": "2019-10-13T16:24:13.000Z",
            "updatedAt": "2019-10-13T16:24:13.000Z"
        },
    ],
    "length": 1,
    "max": 1
}
```

### 204 - Not content

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

## Create a new file

``` sh
POST /api/v1/files
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/form-data | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *no* | File name
**type** | String | *no* | File type
**file** | File | *no* | File to setup

### 200 - Created

Return created file

``` json
{
    "id": 1,
    "name": "Human Directives Administrator",
    "size": 13583,
    "type": "int-desc",
    "path": "file_name.pdf",
    "createdAt": "2019-10-13T16:24:13.000Z",
    "updatedAt": "2019-10-13T16:24:13.000Z"
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
      "msg": "Name must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Name must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a file by ID

``` sh
GET /api/v1/files/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File ID

### Params

Key | Type | Optional | Description
- | - | - | -
**archived** | Boolean | *yes* | Only archived document

### 200 - File

``` json
{
    "id": 1,
    "name": "Human Directives Administrator",
    "size": 13583,
    "type": "int-desc",
    "path": "file_name.pdf",
    "createdAt": "2019-10-13T16:24:13.000Z",
    "updatedAt": "2019-10-13T16:24:13.000Z"
}
```

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**

## Update a file by ID

``` sh
PUT /api/v1/files/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File ID

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/form-data | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *yes* | File name
**type** | String | *yes* | File type
**file** | File | *yes* | File to setup

### 200 - Updated file

``` json
{
    "id": 1,
    "name": "Human Directives Administrator",
    "size": 13583,
    "type": "int-desc",
    "path": "file_name.pdf",
    "createdAt": "2019-10-13T16:24:13.000Z",
    "updatedAt": "2019-10-13T16:24:13.000Z"
}
```

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
      "msg": "Name must be of type string",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a file by ID

``` sh
DELETE /api/v1/files/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File ID

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**

## Get internships related to a file by giving his ID

``` sh
GET /api/v1/files/:id/internships
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File ID

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - Internships

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
    "state": "waiting",
    "publishAt": "2019-10-13T16:21:25.000Z",
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

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

## Link internship to file

``` sh
GET /api/v1/files/:id/internships/:internship_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File ID
**internship_id** | String | Internship ID

### 200 - OK

Ok appears on two occasions

* If entries have been linked
* If internship type haven't been found

``` json
OK
```

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
