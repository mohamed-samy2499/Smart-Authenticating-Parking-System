import { ReactComponent } from '*.svg'
import CSS from 'csstype'
import { ChangeEvent } from 'react'
export interface GInputProps {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void,
	value?: string,
	type?: string
	checked?: boolean,
	label?: string,
	placeholder?: string,
	name?: string,
	id?: string,
	ariaDescribedby?: string,
	disabled?: boolean,
	helpText?: string,
	error?: string,
	icon?: typeof ReactComponent,
	className?: string
	ref?: any,
	iconPosition?: 'start' | 'end',
	dropdownOptions?: string[],
	style?: CSS.Properties,
}
