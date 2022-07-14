/* This example requires Tailwind CSS v2.0+ */
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from 'utils'


interface GTogglePropsType {
	label?: string,
	activeColor?: string | 'success' | 'warning' | 'danger'
	description?: string,
	checked: boolean,
	disabled?: boolean,
	onChange: () => void
}

export function GToggle(props: GTogglePropsType) {
	const { label, description, disabled, checked, onChange, activeColor = 'primary' } = props
	const activeBgColorClasses: any = {
		primary: 'rgba(38 132 214)',
		success: 'rgba(118 195 73)',
		warning: 'rgba(244 128 36)',
		danger: 'rgba(213 28 42)',
	}
	let activeBgColor = activeBgColorClasses[activeColor]
	// activeBgColor = activeBgColor? activeBgColor : `bg-[${activeColor}]`
	activeBgColor = activeBgColor ? activeBgColor : activeColor
	return (
		<Switch.Group as="div" className="flex items-center justify-start space-x-4">
			<Switch
				disabled={disabled}
				checked={checked}
				onChange={onChange}
				style={{ backgroundColor: checked ? activeBgColor : '#F3F4F6' }}
				className={classNames(
					'inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none flex items-center '
				)}
			>
				<span
					aria-hidden="true"
					className={classNames(
						checked ? 'translate-x-5' : 'translate-x-0',
						'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 '
					)}
				/>
			</Switch>
			{label || description ? <span className="flex flex-col">
				{label && <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
					{label}
				</Switch.Label>}
				{description && <Switch.Description as="span" className="text-sm text-gray-500">
					{description}
				</Switch.Description>}
			</span> : null}
		</Switch.Group>
	)
}
