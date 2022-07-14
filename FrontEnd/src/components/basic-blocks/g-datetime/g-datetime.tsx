import moment from 'moment'
import { GTooltip } from '../g-tooltip'

export const GDateTime = (props:{date?:Date|null,time?:boolean}) => {
	const { date,time=false } = props

	const format =`MMMM Do, YYYY${ time?(' - hh:mm:ss A'):''}`
	if (!date) return <span>N/A</span>

	return (
		<GTooltip content={moment(date).format(format)}>
			<span>{moment(date).fromNow()} </span>
		</GTooltip>
	)
}