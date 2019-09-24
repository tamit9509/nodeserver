'use strict';

const swaggerUI = require('swagger-ui-express');
const swJson = require('../services/swaggerService');
const Joi = require('joi');
let path = require('path')
const Mongoose = require('mongoose')
const CONFIG = require('../config');
const CONSTANTS = require('../utils/constants');
const commonFunctions = require('../utils/commonFunction');

const authService = require('../services/authService');

let routeUtils = {};

/**
 * function to create routes in the express.
 */
routeUtils.route = async (app, routes = []) => {
  routes.forEach(route => {
    let middlewares = [getValidatorMiddleware(route)];
    if (route.auth === CONSTANTS.AVAILABLE_AUTHS.USER) {
      middlewares.push(authService.authValidator());
    }
    app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
  });
  createSwaggerUIForRoutes(app, routes);
};

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} route 
 */
let joiValidatorMethod = async (request, route) => {
  if (route.joiSchemaForSwagger.params && Object.keys(route.joiSchemaForSwagger.params).length) {
    request.params = await Joi.validate(request.params, route.joiSchemaForSwagger.params);
  }
  if (route.joiSchemaForSwagger.body && Object.keys(route.joiSchemaForSwagger.body).length) {
    request.body = await Joi.validate(request.body, route.joiSchemaForSwagger.body);
  }
  if (route.joiSchemaForSwagger.query && Object.keys(route.joiSchemaForSwagger.query).length) {
    request.query = await Joi.validate(request.query, route.joiSchemaForSwagger.query);
  }
  if (route.joiSchemaForSwagger.headers && Object.keys(route.joiSchemaForSwagger.headers).length) {
    let headersObject = await Joi.validate(request.headers, route.joiSchemaForSwagger.headers);
    request.headers.authorization = headersObject.authorization;
  }
};

/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route 
 */
let getValidatorMiddleware = (route) => {
  return (request, response, next) => {
    joiValidatorMethod(request, route).then((result) => {
      return next();
    }).catch((err) => {
      let error = commonFunctions.convertErrorIntoReadableForm(err);
      let responseObject = CONSTANTS.RESPONSE.ERROR.BAD_REQUEST(error.message.toString());
      return response.status(responseObject.statusCode).json(responseObject);
    });
  };
}

/**
 * middleware
 * @param {*} handler 
 */
let getHandlerMethod = (route) => {
  let handler = route.handler
  return (request, response) => {
    let payload = {
      ...(request.body || {}),
      ...(request.params || {}),
      ...(request.query || {}),
      user: (request.user ? request.user : {}),
    };
    //request handler/controller
    if (route.getExactRequest) {
      request.payload = payload;
      payload = request
    }
    handler(payload)
      .then((result) => {
        if (result.filePath) {
          let filePath = path.resolve(__dirname + '/../' + result.filePath)
          return response.status(result.statusCode).sendFile(filePath)
        }
        response.status(result.statusCode).json(result);
      })
      .catch((err) => {
        console.log('Error is ', err);
        if (!err.statusCode && !err.status) {
          err = CONSTANTS.RESPONSE.ERROR.INTERNAL_SERVER_ERROR(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
        }
        response.status(err.statusCode).json(err);
      });
  };
};

/**
 * function to create Swagger UI for the available routes of the application.
 * @param {*} app Express instance.
 * @param {*} routes Available routes.
 */
let createSwaggerUIForRoutes = (app, routes = []) => {
  const swaggerInfo = CONFIG.SWAGGER.info

  swJson.swaggerDoc.createJsonDoc(swaggerInfo);
  routes.forEach(route => {
    swJson.swaggerDoc.addNewRoute(route.joiSchemaForSwagger, route.path, route.method.toLowerCase());
  });

  const swaggerDocument = require('../swagger.json');
  app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};


let setMongooseId = () => {
  let joiObject = Joi.string()
  joiObject.mongooseId = function () {
    return this._test('mongodbId', undefined, function (value, state, options) {
      return Mongoose.Types.ObjectId(value);
    })
  }
  return joiObject.mongooseId();
}

let setTitleCase = () => {
  let joiObject = Joi.string()
  joiObject.titleCase = function () {
    return this._test('mongodbId', undefined, function (value, state, options) {
      if (!!value) {
        return ('' + value).split(' ').map(str => str.trim()).filter(str => !!str).map(str => { return str[0].toUpperCase() + str.slice(1) }).join(' ')
      } else {
        return value
      }
    })
  }
  return joiObject.titleCase();
}


/**
 * common validation Joi condition utilities.
 */
routeUtils.validation = {
  titleCase: setTitleCase(),
  mongooseId: setMongooseId().error(new Error('invalid mongoose id')),
  resourceMongooseId: setMongooseId().required().error(new Error('invalid resource id')).description('mongodb Id of resource to get/update/delete'),
  numberConvert: Joi.number().options({ convert: true }),
  statusSetter: Joi.bool().optional().description('true - enable resource, false - deactivate resource (soft delete)'),
  arrayWithEnumStrings: (enums, minItems, maxItems) => {
    let validArray = Joi.array().items(Joi.string().valid(commonFunctions.getEnumArray(enums))).description(stringArrayDescription(enums, minItems, maxItems))
    if (minItems) { validArray = validArray.min(minItems) };
    if (maxItems) { validArray = validArray.max(maxItems) };
    return validArray;
  },
  numberEnums: enums => Joi.number().valid(commonFunctions.getEnumArray(enums)).options({ convert: true }).description(getEnumDescription(enums)),
  get paginator() {
    return {
      sortDirection: this.numberEnums(CONSTANTS.SORTDIRECTION),
      sortKey: Joi.string().optional().description('specify key to sort on basis of e.g. "keyname" for ascending,"-keyname" for descending '),
      index: this.numberConvert.optional().default(0).description('start index of records to fetch'),
      limit: this.numberConvert.optional().default(20).description('limit of number of records to fetch'),
    }
  },
  emptyString: Joi.string().allow('').optional()
}


/**
 * create description of Number Enums
 * @param {JSON} enumObject
 * @returns {String} description
 */
let getEnumDescription = (enumObject) => {
  let description = ''
  for (let key in enumObject) {
    description += `${enumObject[key]} - ${key} <br>`
  }
  return description;
}

/**
 * creates description.
 * 
 * @param {*} enumsArray
 * @param {*} minItems
 * @param {*} maxItems
 * @returns
 */
let stringArrayDescription = (enumsArray, minItems, maxItems) => {
  let description = ''
  if (!!minItems) description += ` minimum items = ${minItems}<br>`
  if (!!maxItems) description += ` maximum items = ${maxItems}<br>`
  description += 'example <br>[' +
    Object.keys(enumsArray).map(key => '"' + enumsArray[key] + '"').join('<br>') +
    ']';
  return description;
}


module.exports = routeUtils;