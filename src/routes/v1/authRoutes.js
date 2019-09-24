'use strict';

const Joi = require('joi');
const CONSTANTS = require('../../utils/constants');
const commonFunctions = require('../../utils/commonFunction');
//load controllers
const authController = require('../../controllers/v1/authController');
const routeUtils = require('../../utils/routeUtils');

let routes = [
	{
		method: 'POST',
		path: '/v1/auth/register',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('emailId of user'),
				name: Joi.string().required().description('name of user'),
				phoneNumber: Joi.string().required().description('phone number of user'),
				password: Joi.string().optional().description('password of user'),
			},
			group: 'Auth',
			description: 'Route to register an user to the system.',
			model: 'Register'
		},
		handler: authController.registerUser
	},
	{
		method: 'POST',
		path: '/v1/auth/login',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('Your username.'),
				password: Joi.string().required().description('Your password.'),
			},
			group: 'Auth',
			description: 'Route to login an user to the system.',
			model: 'Login'
		},
		handler: authController.loginUser
	},
	{
		method: 'POST',
		path: '/v1/auth/logout',
		joiSchemaForSwagger: {
			headers: Joi.object({
				'authorization': Joi.string().required().description('Your\'s JWT token.')
			}).unknown(),
			body: {
			},
			group: 'Auth',
			description: 'Route to logout an user from the system.',
			model: 'Logout'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: authController.logoutUser
	},
	{
		method: 'POST',
		path: '/v1/auth/forgot_password',
		joiSchemaForSwagger: {
			body: {
				email: Joi.string().email().required().description('email Id of registered user')
			},
			group: 'Auth',
			description: 'Route to logout an user from the system.',
			model: 'ForgotPassword'
		},
		auth: false,
		getExactRequest: true,
		handler: authController.forgotPassword
	},
	{
		method: 'GET',
		path: '/v1/auth/reset_password_page/:resetPasswordToken',
		joiSchemaForSwagger: {
			params: {
				resetPasswordToken: Joi.string().required().description('reset password token'),
			},
			group: 'Auth',
			description: 'Route to logout an user from the system.',
			model: 'ResetPasswordPage'
		},
		auth: false,
		handler: authController.getResetPasswordPage
	},
	{
		method: 'POST',
		path: '/v1/auth/change_password',
		joiSchemaForSwagger: {
			body: {
				token: Joi.string().required(),
				password: Joi.string().min(3).required()
			},
			group: 'Auth',
			description: 'Route to logout an user from the system.',
			model: 'ChangePassword'
		},
		auth: false,
		handler: authController.changePassword
	},
	{
		method: 'POST',
		path: '/v1/auth/check_authenticated',
		joiSchemaForSwagger: {
			headers: Joi.object({
				'authorization': Joi.string().required().description('Your\'s JWT token.')
			}).unknown(),
			group: 'Auth',
			description: 'Route to logout an user from the system.',
			model: 'check if authenticated'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: authController.checkAuthenticated
	},
	{
		method: 'POST',
		path: '/v1/auth/email_verification/:token',
		joiSchemaForSwagger: {
			group: 'Auth',
			description: 'Route to logout an user from the system.',
			model: 'check if authenticated'
		},
		handler: authController.emailVerification
	}
]
module.exports = routes;