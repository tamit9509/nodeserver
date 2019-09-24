'use strict';


let CONSTANTS = {};

CONSTANTS.SERVER = {
  ADMINPASSWORD: process.env.ADMIN_PASSWORD,
}

CONSTANTS.SORTDIRECTION = {
  ASCENDING: 1,
  DESCENDING: 2
}
CONSTANTS.USER_ROLES = {
  NORMAL: 1,
  ADMIN: 2
};

CONSTANTS.AVAILABLE_AUTHS = {
  USER: 'user',
};




CONSTANTS.NORMAL_PROJECTION = { __v: 0, isDeleted: 0, createdAt: 0, updatedAt: 0 };

CONSTANTS.MESSAGES = require('./messages');

CONSTANTS.SECURITY = {
  JWT_SIGN_KEY: 'fasdkfjklandfkdsfjladsfodfafjalfadsfkads',
  BCRYPT_SALT: 8
};

CONSTANTS.RESPONSE = {
  ERROR: {
    DATA_NOT_FOUND: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 404,
        message: message,
        status: false,
        type: 'DATA_NOT_FOUND',
      };
    },
    BAD_REQUEST: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 400,
        message: message,
        status: false,
        type: 'BAD_REQUEST',
      };
    },
    MONGO_EXCEPTION: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 100,
        message: message,
        status: false,
        type: 'MONGO_EXCEPTION',
      };
    },
    ALREADY_EXISTS: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 400,
        message: message,
        status: false,
        type: 'ALREADY_EXISTS',
      };
    },
    FORBIDDEN: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 403,
        message: message,
        status: false,
        type: 'Forbidden',
      };
    },
    INTERNAL_SERVER_ERROR: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 500,
        message: message,
        status: false,
        type: 'INTERNAL_SERVER_ERROR',
      };
    },
    UNAUTHORIZED: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 401,
        message: message,
        status: false,
        type: 'UNAUTHORIZED',
      };
    }
  },
  SUCCESS: {
    MISSCELANEOUSAPI: (message) => {
      if (!message) {
        message = '';
      }
      return {
        statusCode: 200,
        message: message,
        status: true,
        type: 'Default',
      };
    }
  }
};


CONSTANTS.DEFAULT_RESPONSES = [
  { code: 200, message: 'OK' },
  { code: 400, message: 'Bad Request' },
  { code: 401, message: 'Unauthorized' },
  { code: 404, message: 'Data Not Found' },
  { code: 500, message: 'Internal Server Error' }
];

CONSTANTS.PATH_TO_RESET_PASSWORD_TEMPLATE = './utils/templates/reset-password.html';
CONSTANTS.PATH_TO_RESET_PASSWORD_LINK_EXPIRED_TEMPLATE = './utils/templates/password-link-expired.html';
CONSTANTS.EMAIL_CONTENTS = require('./emailTemplates');

CONSTANTS.EMAIL_SUBJECTS = {
  WELCOME_VERIFICATION_EMAIL: 'User Verification Email:  SelfFound',
  FORGOT_PASSWORD_EMAIL: 'Forgot Password: SelfFound'
};

CONSTANTS.EMAIL_SENT_MESSAGE = 'Please verify your email from registered email account.'

CONSTANTS.EMAIL_TYPES = {
  WELCOME_VERIFICATION_EMAIL: 1,
  FORGOT_PASSWORD_EMAIL: 2,
  FORGOT_PASSWORD_EMAIL_UPDATED: 3
};



module.exports = CONSTANTS;