import { Country } from 'country-data'
import CSS from 'csstype'

export interface GMultiSelectPropsType<T> {
	value: Array<any>,
	options: Array<any>,
	loopKey?: string,
	label?: string,
	disabled?: boolean,
	error?: string,
	style?: CSS.Properties,
	className?: string,
	placeholder?: string,
	onChange: (e: any) => void,
	renderLabel: (v: T | any, isSelected?: boolean) => JSX.Element | string | void | Array<any> | any | Element,
	renderSelected: (v: T | any) => JSX.Element | string | void | Array<any> | any | Element,
}