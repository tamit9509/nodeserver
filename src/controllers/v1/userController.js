"use strict";

const commonFunctions = require('../../utils/commonFunction');
const CONSTANTS = require("../../utils/constants");
const userModel = require('../../models/userModel')
const userService = require('../../services/userService');
const _ = require('lodash');
const _success = CONSTANTS.RESPONSE.SUCCESS;
const _error = CONSTANTS.RESPONSE.ERROR;
const _messages = CONSTANTS.MESSAGES;

/***************************************************
 ***** User controller for User management logic ***
 ***************************************************/
let userController = {};

/**
 * function to create resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userController.createResource = async (payload) => {
  let data = await userService.createResource(payload);
  return Object.assign(
    _success.MISSCELANEOUSAPI(_messages.CREATE_SUCCESS),
    { data }
  )
};

/**
 * function to update resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userController.updateResource = async (payload) => {
  let data = _.omit(await userService.updateResource(payload) || {}, ['password', 'createdAt', '__v'])
  return Object.assign(
    _success.MISSCELANEOUSAPI(_messages.UPDATE_SUCCESS),
    { data }
  )
};


/**
 * function to find resource by id
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userController.findResourceById = async (payload) => {
  let data = _.omit(await userService.findResourceById(payload) || {}, ['password', 'createdAt', '__v'])
  return Object.assign(
    _success.MISSCELANEOUSAPI(_messages.SUCCESS),
    { data }
  )
};

/**
 * function to find resources
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userController.findResource = async (payload) => {
  let data = await userService.findResource(payload);
  return Object.assign(
    _success.MISSCELANEOUSAPI(_messages.SUCCESS),
    { data }
  )
};

/**
 * function to delete resources by id
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userController.deleteResource = async (payload) => {
  let data = await userService.deleteResource(payload);
  return Object.assign(
    _success.MISSCELANEOUSAPI(_messages.DELETE_SUCCESS),
    { data }
  )
};



/**
 * function to delete change password of user
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userController.changePassword = async (payload) => {
  let data = await userService.changePassword(payload);
  return Object.assign(
    _success.MISSCELANEOUSAPI(_messages.PASSWORD_CHANGED),
  )
};
/* export authControllers */
module.exports = userController;