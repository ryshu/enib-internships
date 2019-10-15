---
id: api-mentoring-propostions
title: Mentoring propositions
---

Details of routes to handle **mentoringPropositions**

## List of all mentoring propositions

``` sh
GET /api/v1/mentoringPropositions
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - List of mentoring propositions

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "comment": "Human Directives Administrator",
            "createdAt": "2019-10-13T16:24:13.000Z",
            "updatedAt": "2019-10-13T16:24:13.000Z"
        },
    ],
    "length": 1,
    "max": 1
}
```

### 204 - Not content

If the API doesn't have any mentoring proposition in his database, we return a status **204 - No content**

## Create a new mentoring propostion

``` sh
POST /api/v1/mentoringPropositions
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**comment** | String | *no* | Mentoring proposition comment

### 200 - Created

Return created mentoring proposition

``` json
{
    "id": 1,
    "comment": "Human Directives Administrator",
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
      "msg": "Comment must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Comment must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a mentoring proposition by identifier

``` sh
GET /api/v1/mentoringPropositions/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring proposition identifier

### 200 - Mentoring proposition

``` json
{
    "id": 1,
    "comment": "Human Directives Administrator",
    "createdAt": "2019-10-13T16:24:13.000Z",
    "updatedAt": "2019-10-13T16:24:13.000Z"
}
```

### 204 - No content

If the API doesn't have any mentoring proposition in his database, we return a status **204 - No content**

## Update a mentoring proposition by identifier

``` sh
PUT /api/v1/mentoringPropositions/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring proposition identifier

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**comment** | String | *yes* | Mentoring proposition comment

### 200 - Updated mentoring proposition

``` json
{
    "id": 1,
    "comment": "Human Directives Administrator",
    "createdAt": "2019-10-13T16:24:13.000Z",
    "updatedAt": "2019-10-13T16:24:13.000Z"
}
```

### 204 - No content

If the API doesn't have any mentoring proposition in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Comment must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Comment must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a mentoring proposition by identifier

``` sh
DELETE /api/v1/mentoringPropositions/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring proposition identifier

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any mentoring proposition in his database, we return a status **204 - No content**
