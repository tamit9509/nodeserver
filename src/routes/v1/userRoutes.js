'use strict';

const Joi = require('joi');
const CONSTANTS = require('../../utils/constants');
const commonFunctions = require('../../utils/commonFunction');
//load controllers
const userController = require('../../controllers/v1/userController');
const routeUtils = require('../../utils/routeUtils')


let routes = [
	{
		method: 'POST',
		path: '/v1/user',
		joiSchemaForSwagger: {

			body: {
				email: Joi.string().email().required().description('emailId of user'),
				name: routeUtils.validation.titleCase.required().description('name of user'),
				// TODO -- change to require or generate password randomly
				password: Joi.string().optional().description('password of user'),
				// Todo -- change type
				role: Joi.string(),
				status: Joi.boolean().optional().description('update to true will soft delete user'),
				designationId: routeUtils.validation.mongooseId.optional().description('designationId'),
				employeeId: Joi.string().optional().description('employee Id of user'),
				joiningDate: Joi.string().isoDate().optional().description('joining date'),
				address: Joi.string().optional(),
				description: Joi.string().optional(),
			},
			group: 'User',
			description: 'Api to create an user',
			model: 'create_user'
		},
		auth: false,
		handler: userController.createResource
	},
	{
		method: 'PUT',
		path: '/v1/user/:_id',
		joiSchemaForSwagger: {
			params: {
				_id: routeUtils.validation.resourceMongooseId
			},
			body: {
				email: Joi.string().email().optional().description('Your email.'),
				name: routeUtils.validation.titleCase.optional().description('name of user'),
				password: Joi.string().optional().description('Your password.'),
				role: Joi.string(),
				status: Joi.boolean().optional().description('update to true will soft delete user'),
				designationId: routeUtils.validation.mongooseId.optional().description('designationId'),
				employeeId: Joi.string().optional().description('employee Id of user'),
				joiningDate: Joi.string().isoDate().description('joining date'),
				address: Joi.string().optional(),
				description: Joi.string().optional(),
			},
			group: 'User',
			description: 'Api to update an user',
			model: 'update_user'
		},
		auth: false,
		handler: userController.updateResource
	},
	{
		method: 'POST',
		path: '/v1/user/changePassword',
		joiSchemaForSwagger: {
			body: {
				oldPassword: Joi.string().optional().required('old password if need to change password'),
				password: Joi.string().optional().description('Your password.')
			},
			group: 'User',
			description: 'Api to change password an user',
			model: 'change_password_user'
		},
		auth: CONSTANTS.AVAILABLE_AUTHS.USER,
		handler: userController.changePassword
	},
	{
		method: 'GET',
		path: '/v1/user/:_id',
		joiSchemaForSwagger: {
			params: {
				_id: routeUtils.validation.resourceMongooseId
			},
			group: 'User',
			description: 'Api to get an user by id',
			model: 'get_user_by_id'
		},
		auth: false,
		handler: userController.findResourceById
	},
	{
		method: 'GET',
		path: '/v1/user',
		joiSchemaForSwagger: {
			query: {
				softDeleted: Joi.boolean().description('show soft deleted records'),
				searchString: routeUtils.validation.emptyString.description('search user by emailId'),
				...routeUtils.validation.paginator,

				status: Joi.boolean().optional().description('get search deleted options'),
				userIds: Joi.array().items(routeUtils.validation.resourceMongooseId).optional().description('get documents of these Ids')
			},
			group: 'User',
			description: 'Api to get users',
			model: 'get_users'
		},
		auth: false,
		handler: userController.findResource
	},
	{
		method: 'DELETE',
		path: '/v1/user/:_id',
		joiSchemaForSwagger: {
			params: {
				_id: routeUtils.validation.resourceMongooseId
			},
			query: {
				hardDelete: Joi.boolean().default(false).optional()
			},
			group: 'User',
			description: 'Api to delete users',
			model: 'delete_users'
		},
		auth: false,
		getExactRequest: false,
		handler: userController.deleteResource
	}
]

module.exports = routes;