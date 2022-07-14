import { GbuttonProps } from '../g-button/types'

export type Options = 'Last 30 days' | 'Last 7 days' | 'This week' | 'Last week' | 'Last month' | 'Custom'

export interface GDateRangeProps {
	onChange: (e: { from: Date, to: Date }) => void,
	label?: string
	align?: 'left' | 'right'
	variant?: GbuttonProps['variant']
	color?: GbuttonProps['color']
	className?: string
	buttonLabel?: string
}