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

## Get a mentoring proposition by ID

``` sh
GET /api/v1/mentoringPropositions/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring proposition ID

### 200 - Mentoring proposition

``` json
{
    "id": 1,
    "comment": "Human Directives Administrator",
    "campaign": null,
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

## Update a mentoring proposition by ID

``` sh
PUT /api/v1/mentoringPropositions/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring proposition ID

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
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a mentoring proposition by ID

``` sh
DELETE /api/v1/mentoringPropositions/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring proposition ID

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any mentoring proposition in his database, we return a status **204 - No content**

## Get campaign related to an proposition by giving his ID

``` sh
GET /api/v1/mentoringPropositions/:id/campaigns
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring propostion ID

### 200 - Campaigns list

If a campaign is linked to given proposition, return this struct

``` json
{
  "id": 1,
  "maxProposition": 2,
  "name": "test",
  "semester": "S5",
  "startAt": 0,
  "endAt": 0,
  "updatedAt": "2019-09-19T22:21:24.365Z",
  "createdAt": "2019-09-19T22:21:24.365Z"
},
```

If not any campaign is linked to given propostion, return this struct

``` json
{}
```

### 204 - No content

If the API doesn't have any proposition in database link to given ID, we return a status **204 - No content**

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

## Link campaign to proposition

``` sh
GET /api/v1/mentoringPropositions/:id/campaigns/:campaign_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Mentoring proposition ID
**campaign_id** | String | Campaign ID

### 200 - OK

Data are linked

### 204 - No content

If the API doesn't have requested campaign or proposition in his database, we return a status **204 - No content**

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
