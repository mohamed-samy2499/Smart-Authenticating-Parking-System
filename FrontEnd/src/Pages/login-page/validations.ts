import Joi from 'joi'

export const loginFormSchema = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
	password: Joi.string().required().label('Password'),
})