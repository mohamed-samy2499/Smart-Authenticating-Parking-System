import _ from 'lodash'

export function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export function getQuery(search: string) {
	const query = new URLSearchParams(search)
	function paramsToObject(entries: any) {
		const result: any = {}
		for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
			result[key] = value
		}
		return result
	}
	return paramsToObject(query)
}

export const formatCurrency = (value?: number) => {
	if (!value) return 'Free'
	return `$${(value / 100).toFixed(2)}`
}

export const formatPriceInterval = (interval?: string, count?: number) => {
	if (!interval) return ''
	return count === 1 ? `/${interval}` : `every ${count} ${interval}s`
}
export const formatInterval = (interval?: string, count?: number) => {
	if (!interval) return ''
	return count === 1 ? `Every ${interval}` : `Every ${count} ${interval}s`
}

export const searchArray = <T>(array: T[], searchQuery: string, paths: string[]) => {
	const data = [...array]
	return data.filter((item) => {
		let valid = false
		paths.forEach((path) => {
			if (valid) return
			const pathData = _.get(item, path)
			valid = pathData?.trim().toLowerCase().includes(searchQuery.toLowerCase())
		})
		return valid
	})
}
export const millisToMinutesAndSeconds = (millis: number) => {
	const minutes = Math.floor(millis / 60000)
	const seconds = Number(((millis % 60000) / 1000).toFixed(0))
	return minutes + ' mins ' + (seconds < 10 ? '0' : '') + seconds + ' secs '
}


