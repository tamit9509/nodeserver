const jwt = require('jsonwebtoken');
const CONFIG = require('../config')
const CONSTANTS = require('../utils/constants');
const _ = require('lodash');
const _error = CONSTANTS.RESPONSE.ERROR;
const _messages = CONSTANTS.MESSAGES;

const designationModel = require('../models/designationModel');

const commonFunctions = require('../utils/commonFunction');
const dbUtils = require('../utils/dbUtils')
let designationService = {};


/**
 * function to create resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
designationService.createResource = async (payload) => {
  await dbUtils.checkDuplicateEntries(designationModel, undefined, payload, ['email']);
  return await (new designationModel(payload)).save();
}


/**
 * function to update resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
designationService.updateResource = async (payload) => {
  let dataToUpdate = _.omit(payload, 'user', '_id')

  let resource = await designationModel.findByIdAndUpdate(payload._id, dataToUpdate, { new: true });
  if (!resource) {
    throw _error.BAD_REQUEST(_messages.NOT_FOUND);
  }
  return resource
}

/**
 * function to find resource by id
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
designationService.findResourceById = async (payload) => {
  return await designationModel.findById(payload._id, { password: 0 }, { new: true });
}

designationService.findResource = async (payload) => {
  let defaultMatch = {};
  if (payload.softDeleted !== true) {
    defaultMatch.isDeleted = { $ne: true };
  }
  let sortCondition = dbUtils.getSortCondition(payload,'name');
  let query = [
    ...dbUtils.aggregateMatch(payload, ['name','status'], ['name'],undefined,defaultMatch),
    ...dbUtils.paginateWithTotalCount(sortCondition, payload.index, payload.limit)
  ]
  return (await designationModel.aggregate(query))[0] || { items: [], totalCount: 0 };
}

/**
 * function to delete resource
 *
 * @param {*} payload
 * @returns {Promise<JSON>}
 */
designationService.deleteResource = async (payload) => {

  if (!payload.hardDelete) {
    let dataToUpdate = {
      isDeleted: false,
      deletedAt: Date.now()
    }
    return await designationModel.findByIdAndUpdate(payload._id, { $set: dataToUpdate }, { new: true });
  }
  return await designationModel.findByIdAndDelete(payload._id);
}


module.exports = designationService;