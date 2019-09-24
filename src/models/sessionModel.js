"use strict";
/************ Modules **********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const CONSTANTS = require('../utils/constants');

/**************************************************
 ************ User Session Model or collection **********
 **************************************************/
const userSessionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  accessToken: { type: String, default: '' },
  // deviceToken: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  // deviceType: { type: Number, default: CONSTANTS.DEVICE_TYPE.IOS }
});

module.exports = MONGOOSE.model('userSession', userSessionSchema);