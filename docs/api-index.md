---
id: api-index
title: Internships manager API
---

In internships manager, we use API to handle all data.

The API is compound of:

* REST API to provide data and operations on data

## REST API

REST API, or representational state transfer API is a software architectural style that defines a set of constraintes to be used for creating Web services.
In this architecture, you might provide for each data in your application following end-points (or routes) in your API

* **GET** all data
* **POST** Create new data
* **GET** data by his primary key
* **PUT** Update data
* **DELETE** Remove data

For example, if we have `products` entity in our applications, the we have the following routes on our api:

* **GET** '/products' -> list of products
* **POST** '/products' -> create a new products
* **GET** '/products/:id' -> get the product link to id
* **PUT** '/products/:id' -> update the product link to id
* **DELETE** '/products/:id' -> remove the product link to id

REST API is available under `/api/v1/` path.
