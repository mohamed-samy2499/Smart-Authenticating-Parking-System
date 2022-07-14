import { ReactComponent } from '*.svg'
import CSS from 'csstype'
import { ChangeEvent, RefObject } from 'react'

export interface GListboxProps<T> {
	onChange: (v: T) => void,
	renderLabel: (v: T) => JSX.Element | string | Element
	label?: string,
	options: T[],
	value?: T,
	placeholder?: string,
	name?: string,
	id?: string,
	ariaDescribedby?: string,
	disabled?: boolean,
	helpText?: string,
	error?: string,
	style?: CSS.Properties,
	className?: string
}