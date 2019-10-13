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

### 200 - List of files

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

### 204 - Not content

If the API doesn't have any file in his database, we return a status **204 - No content**

## Create a new file

``` sh
POST /api/v1/files
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *no* | File name
**size** | Integer | *no* | File size
**type** | String | *no* | File type
**path** | String | *no* | File path

### 200 - Created

Return created file

``` json
{
    "id": 1,
    "name": "Human Directives Administrator",
    "size": 13583,
    "type": "png",
    "path": "http://maxine.biz",
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

## Get a file by identifier

``` sh
GET /api/v1/files/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File identifier

### 200 - File

``` json
{
    "id": 1,
    "name": "Human Directives Administrator",
    "size": 13583,
    "type": "png",
    "path": "http://maxine.biz",
    "createdAt": "2019-10-13T16:24:13.000Z",
    "updatedAt": "2019-10-13T16:24:13.000Z"
}
```

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**

## Update a file by identifier

``` sh
PUT /api/v1/files/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File identifier

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *yes* | File name
**size** | Integer | *yes* | File size
**type** | String | *yes* | File type
**path** | String | *yes* | File path

### 200 - Updated file

``` json
{
    "id": 1,
    "name": "Human Directives Administrator",
    "size": 13583,
    "type": "png",
    "path": "http://maxine.biz",
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

## Remove a file by identifier

``` sh
DELETE /api/v1/files/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | File identifier

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any file in his database, we return a status **204 - No content**
