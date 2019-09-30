---
id: api-businesses
title: Businesses
---

Details of routes to handle **businesses**

## List of all businesses

``` sh
GET /api/v1/businesses
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - List of businesses

``` json
{
    "page": "1",
    "data": [
        {
            "id": 1,
            "name": "Gusikowski Group",
            "country": "Norfolk Island",
            "city": "West Dashawnborough",
            "postalCode": "63616-5509",
            "address": "917 Lynch Fort",
            "additional": "Suite 464",
            "createdAt": "2019-09-30T11:24:50.000Z",
            "updatedAt": "2019-09-30T11:24:50.000Z"
        },
        {
            "id": 2,
            "name": "Shanahan Group",
            "country": "Azerbaijan",
            "city": "Taylorbury",
            "postalCode": "77677",
            "address": "1629 Auer Stream",
            "additional": "Suite 857",
            "createdAt": "2019-09-30T11:24:50.000Z",
            "updatedAt": "2019-09-30T11:24:50.000Z"
        },
        {
            "id": 3,
            "name": "Kuphal, Hessel and Veum",
            "country": "Venezuela",
            "city": "Koelpinhaven",
            "postalCode": "68033",
            "address": "16229 Labadie Dam",
            "additional": "Suite 385",
            "createdAt": "2019-09-30T11:24:50.000Z",
            "updatedAt": "2019-09-30T11:24:50.000Z"
        }
    ],
    "length": 3,
    "max": 3
}
```

### 204 - Not content

If the API doesn't have any business in his database, we return a status **204 - No content**

## Create a new business

``` sh
POST /api/v1/businesses
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *no* | Business name
**country** | String | *no* | Business country
**city** | String | *no* | Business city
**postalCode** | String | *no* | Business postalCode
**address** | String | *no* | Business address
**additional** | String | *yes* | Address additional detail

### 200 - Created

Return created business

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
      "msg": "City must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "City must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a business by identifier

``` sh
GET /api/v1/businesses/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Business identifier

### 200 - Business

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
}
```

### 204 - No content

If the API doesn't have any business in his database, we return a status **204 - No content**

## Update a business by identifier

``` sh
PUT /api/v1/businesses/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Business identifier

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**name** | String | *yes* | Business name
**country** | String | *yes* | Business country
**city** | String | *yes* | Business city
**postalCode** | String | *yes* | Business postalCode
**address** | String | *yes* | Business address
**additional** | String | *yes* | Address additional detail

### 200 - Updated business

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
}
```

### 204 - No content

If the API doesn't have any business in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "City must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "City must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a business by identifier

``` sh
DELETE /api/v1/businesses/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Business identifier

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any business in his database, we return a status **204 - No content**
