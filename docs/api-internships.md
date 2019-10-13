---
id: api-internships
title: Internships
---

Details of routes to handle **internships**

## List of all internships

``` sh
GET /api/v1/internships
```

### Params

Key | Type | Optional | Description
- | - | - | -
**limit** | Number | *no* | Page expected (By default 1)
**page** | Number | *no* | Number of row expected (By default 20)

### 200 - List of internships

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
            "isLanguageCourse": false,
            "isValidated": false,
            "createdAt": "2019-10-13T16:21:25.000Z",
            "updatedAt": "2019-10-13T16:21:25.000Z"
        },
    ],
    "length": 1,
    "max": 1
}
```

### 204 - Not content

If the API doesn't have any internship in his database, we return a status **204 - No content**

## Create a new internship

``` sh
POST /api/v1/internships
```

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**subject** | String | *no* | Internship subject
**description** | String | *no* | Internship description
**country** | String | *no* | Internship country
**city** | String | *no* | Internship city
**postalCode** | String | *no* | Internship postalCode
**address** | String | *no* | Internship address
**additional** | String | *no* | Address additional detail
**isLanguageCourse** | Boolean | *yes* | Address isLanguageCourse detail
**isValidated** | Boolean | *yes* | Address isValidated detail

### 200 - Created

Return created internship

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
    "isLanguageCourse": false,
    "isValidated": false,
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
      "msg": "Subject must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Subject must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Get a internship by identifier

``` sh
GET /api/v1/internships/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship identifier

### 200 - Internship

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
    "isLanguageCourse": false,
    "isValidated": false,
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

### 204 - No content

If the API doesn't have any internship in his database, we return a status **204 - No content**

## Update a internship by identifier

``` sh
PUT /api/v1/internships/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship identifier

### Headers

Key | Value | Description
- | - | -
**Content-Type** | application/x-www-form-urlencoded | Body encoding

### Body

Key | Type | Optional | Description
- | - | - | -
**subject** | String | *yes* | Internship subject
**description** | String | *yes* | Internship description
**country** | String | *yes* | Internship country
**city** | String | *yes* | Internship city
**postalCode** | String | *yes* | Internship postalCode
**address** | String | *yes* | Internship address
**additional** | String | *yes* | Address additional detail
**isLanguageCourse** | Boolean | *yes* | Address isLanguageCourse detail
**isValidated** | Boolean | *yes* | Address isValidated detail

### 200 - Updated internship

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
    "isLanguageCourse": false,
    "isValidated": false,
    "createdAt": "2019-10-13T16:21:25.000Z",
    "updatedAt": "2019-10-13T16:21:25.000Z"
}
```

### 204 - No content

If the API doesn't have any internship in his database, we return a status **204 - No content**

### 400 - Bad request

API return **Bad Request** status with 400 code when request validation fail.

``` json
{
  "code": 11103,
  "status": 400,
  "errors": [
    {
      "msg": "Subject must be of type string",
      "param": "city",
      "location": "body"
    },
    {
      "msg": "Subject must be defined",
      "param": "city",
      "location": "body"
    }
  ],
  "name": "BAD REQUEST"
}
```

## Remove a internship by identifier

``` sh
DELETE /api/v1/internships/:id
```

### Paths variables

Key | Type | Description
- | - | -
**id** | String | Internship identifier

### 200 - Removed

Return a status **200** without data when delete succeed

### 204 - No content

If the API doesn't have any internship in his database, we return a status **204 - No content**
