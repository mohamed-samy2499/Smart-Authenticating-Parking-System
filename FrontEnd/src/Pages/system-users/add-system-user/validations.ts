import Joi from 'joi'

export const addSystemUserScheme = Joi.object({
	name: Joi.string().required().label('Name'),
	email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
	password: Joi.string().required().label('Password'),
})