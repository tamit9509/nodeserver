"use strict";

const commonFunctions = require('../../utils/commonFunction');
const CONSTANTS = require("../../utils/constants");
const userModel = require('../../models/userModel')
const designationService = require('../../services/designationService');
const _ = require('lodash')
const _success = CONSTANTS.RESPONSE.SUCCESS;
const _error = CONSTANTS.RESPONSE.ERROR;
const _messages = CONSTANTS.MESSAGES;

/***************************************************
 ***** User controller for User management logic ***
 ***************************************************/
let designationController = {};

/**
 * function to create resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
designationController.createResource = async (payload) => {
  let data = await designationService.createResource(payload);
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
designationController.updateResource = async (payload) => {
  let data = _.omit(await designationService.updateResource(payload) || {}, [ 'createdAt', '__v'])
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
designationController.findResourceById = async (payload) => {
  let data = _.omit(await designationService.findResourceById(payload) || {}, [ 'createdAt', '__v'])
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
designationController.findResource = async (payload) => {
  let data = await designationService.findResource(payload);
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
designationController.deleteResource = async (payload) => {
  let data = await designationService.deleteResource(payload);
  return Object.assign(
    _success.MISSCELANEOUSAPI(_messages.DELETE_SUCCESS),
    { data }
  )
};
/* export authControllers */
module.exports = designationController;