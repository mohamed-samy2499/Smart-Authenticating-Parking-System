import Joi from 'joi'
import { min } from 'lodash'

export const customerEditSchema = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
	name: Joi.string().required().label('name'),
	nid: Joi.number().required().min(14).label('nid'),
	isEgyptian: Joi.required(),
	selectedVehicles: Joi.array().min(1).required().label('vehicles'),
})