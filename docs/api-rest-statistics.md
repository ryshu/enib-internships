---
id: api-statistics
title: Statistics
---

Details of routes to handle **statistics**

## Global statistics

``` sh
GET /api/v1/statistics
```

### 200 - Global statistics

``` json
{
  "campaign": 1,
  "internships": {
    "attributed": 0,
    "availables": 0,
    "total": 0,
  },
  "mentors": 0,
  "propositions": 0,
  "students": 0,
}
```

## Campaign statistics

``` sh
GET /api/v1/campaigns/:id/statistics
```

### 200 - Campaign's statistics

``` json
{
  "internships": {
    "archived": 0,
    "attributed": 0,
    "availables": 0,
    "suggested": 0,
    "total": 0,
    "validated": 0,
    "waiting": 0,
  },
  "mentors": 0,
  "propositions": 0,
  "students": 0,
}
```

### 204 - No content

This campaign hasn't been found, we return a status **204 - No content**

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
