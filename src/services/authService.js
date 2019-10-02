const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const gsNodemailer = require('nodemailer-sendgrid-transport');
const CONFIG = require('../config')
const CONSTANTS = require('../utils/constants');

const userModel = require('../models/userModel');

const commonFunctions = require('../utils/commonFunction');
const emailTemplate = require('../utils/emailTemplates');

let authService = {};

const transporter = nodemailer.createTransport(gsNodemailer({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}))
/** 
 * function to register a new  user
 */
authService.registerUser = async (payload) => {
  let emailExist = !!(await userModel.findOne({ email: payload.email }));
  if (emailExist) {
    throw CONSTANTS.RESPONSE.ERROR.ALREADY_EXISTS(CONSTANTS.MESSAGES.EMAIL_ALREADY_EXISTS);
  }
  payload.password = commonFunctions.hashPassword(payload.password)
  let user = new userModel(payload);

  const response = { user: (await user.save()).toObject(), emailMessage: CONSTANTS.EMAIL_SENT_MESSAGE };

  const jwtPayload = {
    _id: response.user._id,
    email: response.user.email
  }
  const token = commonFunctions.encryptJwt(jwtPayload);
  let template = emailTemplate.WELCOME_VERIFICATION_EMAIL;
  template = commonFunctions.getTemplateString(user.name, CONFIG.DOMAIN.FRONTEND_VERIFY_EMAIL_ACCOUNT.replace('{{token}}', token), template);
  const email = {
    to: payload.email,
    from: process.env.SMPT_EMAIL,
    subject: 'Account Verification',
    html: template
  }
  transporter.sendMail(email);
  return response;
}

/**
 * function to edit a new user
 */
authService.login = async (payload) => {
  let user = await userModel.findOne({ email: payload.email, isDeleted: { $ne: true } }).lean();
  if (!user) {
    throw CONSTANTS.RESPONSE.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.ACCOUNT_NOT_EXIST);
  }
  if (user.emailVerificationStatus === false) {
    throw CONSTANTS.RESPONSE.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.EMAIL_VERIFICATION);
  }
  if (user && commonFunctions.compareHash(payload.password, user.password)) {
    let jwtPayload = {
      _id: user._id,
      email: user.email
    }
    return {
      accessToken: commonFunctions.encryptJwt(jwtPayload),
      user
    }
  }
  throw CONSTANTS.RESPONSE.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.INVALID_CREDENTIALS)
}

authService.logout = async () => {
  return true;
}

authService.authValidator = () => {
  return (request, response, next) => {
    authenticateUser(request).then(done => next())
      .catch((err) => {
        let responseObject = CONSTANTS
          .RESPONSE
          .ERROR
          .UNAUTHORIZED(err);
        return response.status(responseObject.statusCode).json(responseObject);
      });
  };
}

/**
 * function to validate jwt token and fetch its details from the system.
 * @param {} request 
 */
let authenticateUser = async (request) => {
  try {
    let decoded = commonFunctions.decryptJwt(request.headers.authorization);
    let user = await userModel.findById(decoded._id)
    if (!!user) {
      request.user = user;
      return true;
    }
    else {
      throw CONSTANTS.MESSAGES.UNAUTHORIZED;
    }
  } catch (err) {
    throw CONSTANTS.MESSAGES.UNAUTHORIZED;
  }
};

authService.forgotPassword = async (request) => {
  // set getExactRequest: true to get request as parameter
  let payload = request.payload;
  payload.host = request.headers.host;
  let user = await userModel.findOne({ email: request.payload.email });
  if (!user) {
    throw CONSTANTS.RESPONSE.ERROR.DATA_NOT_FOUND(CONSTANTS.MESSAGES.NO_USER_FOUND);
  }
  let resetPasswordToken = commonFunctions.encryptJwt({ _id: user._id, email: user.email });
  let resetPasswordLink = `${CONFIG.DOMAIN.FRONTEND_URL}/${CONFIG.DOMAIN.FRONTEND_CHANGE_PASSWORD_URL.replace('{{token}}', resetPasswordToken)}`;
  user.resetPasswordToken = resetPasswordToken;
  user.resePasswordSession = new Date();
  await user.save();
  // let emailData = commonFunctions.emailTypes(user, CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL, { link: resetPasswordLink });
  // let emailContent = commonFunctions.renderTemplate(emailData.template, emailData.data);
  // let emailResponse = commonFunctions.sendEmail(user.email, emailData.Subject, emailContent).then(r => { }, console.log);
  const email = {
    to: user.email,
    from: process.env.SMPT_EMAIL,
    subject: 'Reset Password',

  }
  transporter.sendMail(email);

  return user;
}

authService.isValidResetPasswordLink = async (payload) => {
  try {
    let decoded = commonFunctions.decryptJwt(payload.resetPasswordToken);
    let user = await userModel.findById(decoded._id).lean();
    if (user && user.resetPasswordToken) {
      return true;
    }
    return false;
  } catch (error) {
    return false
  }

}

authService.changePassword = async (payload) => {
  let _id = commonFunctions.decryptJwt(payload.token)._id;
  let updateData = { password: commonFunctions.hashPassword(payload.password), resetPasswordToken: null };
  let user = userModel.findByIdAndUpdate(_id, { $set: updateData }, { new: true });
  return user;
}

authService.emailVerification = async (token) => {
  const id = commonFunctions.decryptJwt(token)._id;
  const user = await userModel.findByIdAndUpdate(id, { $set: { emailVerificationStatus: true } }, { new: true }).lean();
  return user;
}

module.exports = authService;
