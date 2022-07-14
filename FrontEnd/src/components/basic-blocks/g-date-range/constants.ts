import moment from 'moment'
import { Options } from './types'

export const options: Options[] = [
	'Last 30 days',
	'Last 7 days',
	'This week',
	'Last month',
	'Last week',
	'Custom',
]
export const ranges = {
	'Last 30 days': {
		startDate: moment().subtract(30, 'days').toDate(),
		endDate: new Date(),
		key: 'selection'
	},
	'Last 7 days': {
		startDate: moment().subtract(7, 'days').toDate(),
		endDate: new Date(),
		key: 'selection'
	},
	'This week': {
		startDate: moment().startOf('week').toDate(),
		endDate: new Date(),
		key: 'selection'
	},
	'Last week': {
		startDate: moment().subtract(1, 'week').startOf('week').toDate(),
		endDate: moment().subtract(1, 'week').endOf('week').toDate(),
		key: 'selection'
	},
	'Last month': {
		startDate: moment().subtract(1, 'month').startOf('month').toDate(),
		endDate: moment().subtract(1, 'month').endOf('month').toDate(),
		key: 'selection'
	},
	'Custom': {
		startDate: moment().subtract(30, 'days').toDate(),
		endDate: new Date(),
		key: 'selection'
	},
}