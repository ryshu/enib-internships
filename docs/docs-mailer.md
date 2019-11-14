---
id: docs-mailer
title: Mailer service
---

## Configuration

The mailer service use the module [nodemailer](https://nodemailer.com/about/) to handle transport in back-end. To configure you'r SMTP connexion, please fill all environements vars in `services/.env` files prefixed by **SMTP_**.

| Name | Comment | Types | Default |
| ---- | ------- | ----- | ------- |
| SMTP_HOST | SMTP Host | string | smtp.ethereal.email |
| SMTP_PORT | SMTP Port | integer | 587 |
| SMTP_SECURE | SMTP Secure | boolean | false |
| SMTP_AUTH_USER | SMTP Auth user | string | / |
| SMTP_AUTH_PASS | SMTP Auth pass | string | / |

## Usage

To use this service, you only need to import expected template in your program as following

``` javascript
import { sendWelcome } from 'src/emails';

sendWelcome().then((sent) => {
    ...
}).catch((e) => {
    ...
})
```

## Developpement

To develop this service, you could add a template under `services/src/emails/templates/` using following protocol:

* Create a directory with *your template name*
* Create `html.pug` witch extends `services/src/emails/templates/base/html.pug` file.

``` pug
extends ../base/html.pug

block content
    ... your content
```

* Create `subject.pug` for the email subject

``` pug
= `[STAGES] YOUR SUBJECT`
```

* Create `text.pug` for the email text. This file is used to attach to the sent email a text for non-html mailbox.
* Add to `services/src/emails/base.ts` a function to send your email.

``` javascript
/**
 * @summary Method used to send YOUR_TEMPLATE_NAME message to user
 * @param {string} to Dest user
 * @returns {Promise<string>} Resolve: send message
 */
export function sendYOUR_TEMPLATE_NAME(to: string): Promise<string> {
    return email.send({
        template: path.join(__dirname, 'templates', 'YOUR_TEMPLATE_NAME'),
        message: { to },
        locals: {},
    });
}
```
