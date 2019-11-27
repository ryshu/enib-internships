---
id: api-services-emails
title: Emails
---

Details of methods to handle **emails** service

## sendWelcome(to: string, locale?: string)

This method is used to send a welcome message to our new user

### Params

Key | Type | Optional | Description
- | - | - | -
**to** | string | *no* | Dest user email
**locale** | string | *yes* | language to use in email (e.g.: 'fr')

### Return

This method return a Promise

* On resolve, you could catch sended email
* On reject, you could catch the error encountred

## sendCampaignsCreate(to: string, campaigns: Campaigns, locale?: string)

This method is used to send a notification message to mentors when a campaign is created

### Params

Key | Type | Optional | Description
- | - | - | -
**to** | string | *no* | Dest user email
**campaigns** | string | *no* | Instance of the created campaigns
**locale** | string | *yes* | language to use in email (e.g.: 'fr')

### Return

This method return a Promise

* On resolve, you could catch sended email
* On reject, you could catch the error encountred
