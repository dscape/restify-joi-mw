# restify-joi-mw

## Routes

``` js
server.put('/account/:id',
  r.account.validateParams('id'),
  r.account.validate('password'),
  r.account.update);

server.post('/account',
  r.account.validate('email', 'password'),
  r.account.create);
```

## Controller

``` js
var validate = require('restify-joi-mw');

var account = {};

account.validate = validate.mw();
account.validateParams = validate.mw('params');
```

## Schema

```
'use strict';

var Joi = require('joi');

module.exports = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
};
```
