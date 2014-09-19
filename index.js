'use strict';

//
// to do:
//  publish as open source module
//
var joi = require('joi');

module.exports = function(schema) {

  function validateMiddleware(what) {
    //
    // which part of the request do we want to validate
    //
    what = what || 'body';
    return function() {
      //
      // filter the schema
      //
      var args = Array.prototype.slice.call(arguments, 0);
      return function valMw(req, res, next) {
        var validation = validateSchema(req[what], args);
        if (validation.error) {
          validation.error.statusCode = 400;
          next(validation.error);
        } else {
          req[what] = validation.value;
          next();
        }
      };
    };
  }

  function validateSchema(body, properties) {
    if (!body) {
      return {
        error : new Error('body is required'),
        value : {}
      };
    }

    var filteredSchema;

    if (Array.isArray(properties)) {
      filteredSchema = {};
      Object.keys(schema).map(function(key) {
        if (~properties.indexOf(key)) {
          filteredSchema[key] = schema[key];
        }
      });
    }
    var validation = joi.validate(body,
      filteredSchema ? filteredSchema : schema,
    {
      stripUnknown: true,
      abortEarly: true
    });

    return validation;
  }

  return {
    mw: validateMiddleware,
    schema: validateSchema
  };

};
