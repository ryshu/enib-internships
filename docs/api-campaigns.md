---
id: api-campaigns
title: Campaigns
---

Details of routes to handle **campaigns**

## List of all campaigns

``` sh
GET /api/v1/campaigns
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - List of campaigns

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "maxProposition": 2,
            "name": "test",
            "semester": "S5",
            "startAt": 0,
            "endAt": 0,
            "updatedAt": "2019-09-19T22:21:24.365Z",
            "createdAt": "2019-09-19T22:21:24.365Z"
        }
    ],
    "length": 1,
    "max": 1
}
```

### 204 - Not content

If the API doesn't have any campaign in his database, we return a status **204 - No content**

## Create a new campaign

``` sh
POST /api/v1/campaigns
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *no* | Campaign name
**maxProposition** | Integer | *no* | Campaign max proposition
**semester** | String | *no* | Campaign semester
**startAt** | Integer | *no* | Campaign start date
**endAt** | Integer | *no* | Campaign end date

### 200 - Created

Return created campaign

``` json
{
  "id": 1,
  "name": "test",
  "maxProposition": 2,
  "semester": "S5",
  "startAt": 0,
  "endAt": 0,
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

## Get a campaign by ID

``` sh
GET /api/v1/campaigns/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Campaign ID

### 200 - Campaign

``` json
{
  "id": 1,
  "name": "test",
  "maxProposition": 2,
  "semester": "S5",
  "startAt": 0,
  "endAt": 0,
  "propositions": [],
  "updatedAt": "2019-09-19T22:21:24.365Z",
  "createdAt": "2019-09-19T22:21:24.365Z"
}
```

### 204 - No content

If the API doesn't have any campaign in his database, we return a status **204 - No content**

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

## Update a campaign by ID

``` sh
PUT /api/v1/campaigns/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Campaign ID

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *yes* | Campaign name
**maxProposition** | Integer | *yes* | Campaign max proposition
**semester** | String | *yes* | Campaign semester
**startAt** | Integer | *yes* | Campaign start date
**endAt** | Integer | *yes* | Campaign end date

### 200 - Updated campaign

``` json
{
  "id": 1,
  "name": "test",
  "maxProposition": 2,
  "semester": "S5",
  "startAt": 0,
  "endAt": 0,
  "updatedAt": "2019-09-19T22:21:24.365Z",
  "createdAt": "2019-09-19T22:21:24.365Z"
}
```

### 204 - No content

If the API doesn't have any campaign in his database, we return a status **204 - No content**

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

## Remove a campaign by ID

``` sh
DELETE /api/v1/campaigns/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Campaign ID

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any campaign in his database, we return a status **204 - No content**

## Get propositions related to a company by giving his ID

``` sh
GET /api/v1/campaigns/:id/mentoringPropositions
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Campaign ID

### 200 - Propositions list

``` json
[
    {
        "id": 1,
        "comment": "Atque officia consectetur. Eum molestiae rerum qui et. Nostrum fuga molestiae voluptate. Eius omnis nihil non eveniet sed ut. Voluptate provident et voluptate provident illo voluptatem enim ea et. Voluptatem qui reiciendis molestiae rerum blanditiis rem. Ut qui dolor nostrum consequatur accusantium ex esse mollitia atque.",
        "createdAt": "2019-10-13T16:21:25.000Z",
        "updatedAt": "2019-10-13T16:21:25.000Z"
    },
]
```

### 204 - No content

If the API doesn't have any campaign in his database, we return a status **204 - No content**

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

## Link proposition to campaign

``` sh
GET /api/v1/campaigns/:id/mentoringPropositions/:mentoring_proposition_id/link
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Campaign ID
**mentoring_proposition_id** | String | Proposition ID

### 200 - OK

Ok appears on two occasions

* If entries have been linked
* If propositions haven't been found

``` json
OK
```

### 204 - No content

If the API doesn't have any campaign in his database, we return a status **204 - No content**

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