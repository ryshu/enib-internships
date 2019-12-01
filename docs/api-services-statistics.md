---
id: api-services-statistics
title: Statistics
---

Details of methods to handle **statistics** service

This service is build as singletons, to use it, just do as following

``` typescript
...
import cache from '../../statistics/singleton';
...


cache.getCampaign(campaignId);
```

## #.initialized

Var used to know if cache is initialized

## #.init

This method is used to init cache

### Params

Key | Type | Optional | Description
- | - | - | -
**stats** | Statistics | *no* | global statistics for setup
**...campaignStats** | CampaignStatistics[] | *yes* | statistics by campaigns

## #.stateChange

Method used to change state of an internship in cache

### Params

Key | Type | Optional | Description
- | - | - | -
**next** | INTERNSHIP_MODE | *no* | Next internship mode
**prev** | INTERNSHIP_MODE | *yes* | Previous internship mode
**id** | number | *yes* | Campaign id, if internship is link to a campaign

## #.stateAdd

Method used to increase internships stats using mode and quantity

### Params

Key | Type | Optional | Description
- | - | - | -
**state** | INTERNSHIP_MODE | *no* | Mode for apply change
**q** | number | *no* | Quantity to increase
**id** | number | *yes* | Campaign id, if internship is link to a campaign

## #.stateRemove

Method used to decrease internships stats using mode and quantity

### Params

Key | Type | Optional | Description
- | - | - | -
**state** | INTERNSHIP_MODE | *no* | Mode for apply change
**q** | number | *no* | Quantity to decrease (q < 0)
**id** | number | *yes* | Campaign id, if internship is link to a campaign

## #.addMentor

Method used to increment global mentor counter
Use link mentor to increment campaign counters

## #.removeMentor

Method used to decrement global mentor counter
Use unlink mentor to decrement campaign counters

## #.linkMentor

Method used to increment mentor campaign counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *no* | Campaign id

## #.unlinkMentor

Method used to decrement mentor campaign counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *no* | Campaign id

## #.addStudent

Method used to increment student counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *yes* | Campaign id

## #.removeStudent

Method used to decrement student counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *yes* | Campaign id

## #.linkStudent

Method used to increment mentoring propositions campaign counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *no* | Campaign id

## #.addProposition

Method used to increment mentoring propositions counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *yes* | Campaign id

## #.removeProposition

Method used to decrement mentoring propositions counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *yes* | Campaign id

## #.linkProposition

Method used to increment mentoring propositions campaign counter

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *no* | Campaign id

## #.getCampaign

Method used to get Campaign statistics

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *no* | Campaign id

### Returns

* **CampaignStatistics** if campaign is found
* **undefined** if nothing is found

## #.newCampain

Method used to create a new campaign

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *no* | Campaign id
**stat** | Partial<CampaignStatistics> | *no* | Campaign stats

## #.isDefined

Method used to check if campaign statistics are defined

### Params

Key | Type | Optional | Description
- | - | - | -
**id** | number | *no* | Campaign id

### Returns

Boolean, true if defined

## #.reset

This method is used to reset all cache, **be sure to know what you do if you use it**
