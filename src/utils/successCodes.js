let successCodes = {
    LOGIN: {
        statusCode: 200,
        message: 'Logged in Successfully',
        type: 'LOGIN'
    },
    CHECKEMAIL: {
        statusCode: 200,
        message: 'Please Check your email address.',
        type: 'CHECKEMAIL'
    },
    DEFAULT: {
        statusCode: 200,
        message: 'Success',
        type: 'DEFAULT'
    },
    LOGOUT: {
        statusCode: 200,
        message: 'Logged Out Successfully',
        type: 'LOGOUT'
    },
    PASSWORD_CHANGE: {
        statusCode: 200,
        message: 'Password changed successfully',
        type: 'PASSWORD_CHANGE'
    },
    OTP_SENT: {
        statusCode: 200,
        message: 'Otp sent successfully',
        type: 'OTP_SENT'
    }
}

module.exports = successCodes;