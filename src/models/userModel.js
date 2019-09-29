"use strict";
/************* Modules ***********/
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const CONSTANTS = require('../utils/constants');
const commonFunctions = require('../utils/commonFunction')
/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    phoneNumber: { type: String, required: true },
    password: { type: String },
    createdAt: { type: Date, default: Date.now },
    emailVerificationStatus: { type: Boolean, default: false },
    resetPasswordSession: { type: Date },
    mobileVerificationStatus: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
});

// pre-hook to validate reference ids are valid or not.
userSchema.pre('save', async function (next) {
    console.log('user save pre hook')
    next();
});

userSchema.pre('remove', async function (next) {
    console.log('pre remove hook')
    next()
})

module.exports = Mongoose.model('user', userSchema);
