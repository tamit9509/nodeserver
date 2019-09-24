"use strict";
/************* Modules ***********/
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const CONSTANTS = require('../utils/constants');
const commonFunctions = require('../utils/commonFunction');
const errorCodes = require('../utils/errorCodes')
/**************************************************
 ************* Designation Model or collection ***********
 **************************************************/
const designationSchema = new Schema({
    name: { type: String },
    status: { type: Boolean, default: true },
    
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date}
});

designationSchema.pre('remove',async function(next){
    let data = await Mongoose.model('user').findOne({designationId: this._id})
    if(!!data){
        throw errorCodes.DELETE_TARGET_IN_USE;
    }
    return next()
})

module.exports = Mongoose.model('designation', designationSchema);
