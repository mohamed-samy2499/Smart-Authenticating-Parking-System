import Joi from 'joi'

export const carEditScheme = Joi.object({
	plate: Joi.string().required().max(7).min(3).alphanum().label('Plate No.'),
	brand: Joi.string().required().label('Brand'),
	model: Joi.string().required().label('Model'),
	color: Joi.string().required().label('Color'),
	startDate: Joi.date().required().label('Subscription start date'),
	endDate: Joi.string().required().label('Subscription end date'),
})