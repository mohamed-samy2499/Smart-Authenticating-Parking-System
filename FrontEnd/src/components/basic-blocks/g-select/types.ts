import { ReactComponent } from '*.svg'
import CSS from 'csstype'
import { ChangeEvent, RefObject } from 'react'

export interface GSelectProps {
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
	// label?: JSX.Element | string | Element,
	label?: string,
	options?: { label: string | Element | JSX.Element, value: string | number | readonly string[] | undefined }[],
	value?: string,
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