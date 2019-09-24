const jwt = require('jsonwebtoken');
const CONFIG = require('../config')
const CONSTANTS = require('../utils/constants');

const userModel = require('../models/userModel');
const _ = require('lodash')
const _success = CONSTANTS.RESPONSE.SUCCESS;
const _error = CONSTANTS.RESPONSE.ERROR;
const _messages = CONSTANTS.MESSAGES;

const commonFunctions = require('../utils/commonFunction');
const dbUtils = require('../utils/dbUtils')
let userService = {};


/**
 * function to create resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userService.createResource = async (payload) => {
  await dbUtils.checkDuplicateEntries(userModel, undefined, payload, ['email']);
  if (payload.password) {
    payload.password = commonFunctions.hashPassword(payload.password)
  }

  let user = new userModel(payload);
  return await user.save();
}


/**
 * function to update resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userService.updateResource = async (payload) => {
  if (!!payload.password) {
    payload.password = commonFunctions.hashPassword(payload.password)
  }
  let dataToUpdate = _.omit(payload, 'user')
  return await userModel.findByIdAndUpdate(payload._id, dataToUpdate);
}

/**
 * function to find resource by id
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userService.findResourceById = async (payload) => {
  return await userModel.findById(payload._id, { password: 0 }, { new: true });
}
userService.findResource = async (payload) => {
  let defaultMatch = {};
  if (payload.softDeleted !== true) {
    defaultMatch.isDeleted = { $ne: true };
  }
  let exactFeildsToMatch = ['email', 'status', 'isDeleted'];
  let searchKeys = ['email', 'name', 'employeeId'];

  if (payload.userIds && payload.userIds instanceof Array) {
    defaultMatch._id = { $in: payload.userIds }
  }

  let sortCondition = dbUtils.getSortCondition(payload, 'name');

  //lookups
  let designationLookup = {
    from: 'designations',
    localField: 'designationId',
    foreignField: '_id',
    multi: false,
    allowNull: true
  }
  let lookups = [designationLookup];
  let query = [
    ...dbUtils.aggregateMatch(payload, exactFeildsToMatch, searchKeys, undefined, defaultMatch),
    ...dbUtils.lookup(lookups),
    ...dbUtils.paginateWithTotalCount(sortCondition, payload.index, payload.limit)
  ]
  return (await userModel.aggregate(query))[0] || { items: [], totalCount: 0 };
}

/**
 * function to delete resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userService.deleteResource = async (payload) => {

  if (!payload.hardDelete) {
    let dataToUpdate = {
      isDeleted: true,
      deletedAt: Date.now()
    }
    return await userModel.findByIdAndUpdate(payload._id, { $set: dataToUpdate },{new:true});
  }
  return await userModel.findByIdAndDelete(payload._id);
}



/**
 * function to changePassword resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
userService.changePassword = async (payload) => {

  if (commonFunctions.compareHash(payload.oldPassword, payload.user.password)) {
    let dataToUpdate = {
      password: commonFunctions.hashPassword(payload.password)
    }
    return await userModel.findByIdAndUpdate(payload.user._id, { $set: dataToUpdate });
  }
  throw _error.BAD_REQUEST(_messages.INVALID_OLD_PASSWORD)
}
module.exports = userService;