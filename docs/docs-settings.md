---
id: docs-settings
title: Settings
---

## The settings file

The settings file is available under `services/.env`, it will not be created at start because we had it to *.gitignore*.
Copy the `services/.env.example` file if you first.

We use module [dotenv](https://github.com/motdotla/dotenv) to handle settings in the APP.

## Environments variables

| Name | Comment | Default |
| ---- | ------- | ------- |
| MYSQL_HOST | *localhost* or remote server access IP (e.g. 12.35.284.22) | localhost |
| MYSQL_USER | SQL user name | root |
| MYSQL_DATABASE | SQL database name | stages |
| MYSQL_PASSWORD | SQL connection password | / |
| ORM_DROP_DB_ON_START | Set to true if you want to reset database at each server restart | false |
| ORM_LOGGING | Set to true if you want to debug SQL request | false |
| SESSION_SECRET | Random alphanum seed | / |
| CAS_URL | Your [CAS](https://apereo.github.io/cas/6.1.x/index.html) url | / |
| SERVICE_URL | Your service url (use for redirect) | / |
| CAS_DEV_MODE | If [CAS](https://apereo.github.io/cas/6.1.x/index.html) is in dev mode | true |
| HASH_KEY | Random alphanum seed, length=32 | / |
| INTERNSHIP_ENIB_API_VERSION | Used to change API versionning path | v1 |
| INTERNSHIP_ENIB_API_PORT | API port | 4000 |
| BASE_STORAGE_DIR | Directory for files | /caches |

## Generate random seed

To generate random seed, you could go to [RANDOM.ORG](https://www.random.org/strings/)
Generate 2 random string using following options:

* Generate **2**
* Length **32**
* Numeric digit (0-9) **true**
* Uppercase letters (A-Z) **true**
* Lowercase letters (a-z) **true**
* Each string should be unique (like raffle tickets) **true**
