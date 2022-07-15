import clsx from 'clsx'
import { FC } from 'react'
import { RiLoader5Line } from 'react-icons/ri'
import { GbuttonProps } from './types'

const commanClasses = ['shadow-sm', 'inline-flex', 'justify-center', 'items-center', 'border', 'font-medium', 'rounded-md']

const xsmallSizeClasses = { icon: ['h-4 w-4 ml-1'], button: ['py-1 px-3 text-xs'], loading: ['h-4 w-4'] }
const smallSizeClasses = { icon: ['h-5 w-5 ml-2'], button: ['py-1.5 px-4 text-sm'], loading: ['h-5 w-5'] }
const mediumSizeClasses = { icon: ['h-5 w-5 ml-2'], button: ['py-2 px-5 text-sm'], loading: ['h-6 w-6'] }
const largeSizeClasses = { icon: ['h-6 w-6 ml-3'], button: ['py-2 px-6 text-base'], loading: ['h-6 w-6'] }
const xlargeSizeClasses = { icon: ['h-6 w-6 ml-4'], button: ['py-3 px-7 text-base'], loading: ['h-6 w-6'] }

const outlinedClasses = (color: string) => {
	return [`border-${color}-500 shadow-sm bg-transparent text-${color}-500 hover:bg-${color}-500 hover:text-white focus:ring-${color}-500 disabled:bg-transparent disabled:text-${color}-200 disabled:border-${color}-200 font-semibold`]
}

const containedClasses = (color: string) => {
	if (color === 'gray') {
		return [`border bg-white shadow-sm text-${color}-500 hover:bg-gray-50 focus:ring-${color}-500 disabled:bg-${color}-200 disabled:text-gray-400`]
	}
	return [`border-transparent shadow-sm bg-${color}-500 text-white hover:bg-${color}-600 focus:ring-${color}-500 disabled:bg-${color}-300 disabled:text-gray-50 disabled:hover:bg-${color}-300`]
}

const textClasses = (color: string) => {
	return [`border-transparent shadow-sm bg-white text-${color}-500 hover:bg-gray-50 focus:ring-${color}-500 disabled:bg-transparent disabled:text-${color}-200`]
}

export const GButton: FC<GbuttonProps> = (props) => {
	const {
		label,
		children,
		variant = 'contained',
		color = 'neutral',
		size = 'md',
		loading = false,
		disabled = loading || false,
		icon: Icon,
		onClick,
		style = {},
		className,
	} = props

	const sizes = {
		xs: xsmallSizeClasses,
		sm: smallSizeClasses,
		md: mediumSizeClasses,
		lg: largeSizeClasses,
		xl: xlargeSizeClasses,
	}

	const variants = {
		primary: {
			contained: containedClasses('primary'),
			outlined: outlinedClasses('primary'),
			text: textClasses('primary'),
		},
		secondary: {
			contained: containedClasses('secondary'),
			outlined: outlinedClasses('secondary'),
			text: textClasses('secondary'),
		},
		success: {
			contained: containedClasses('success'),
			outlined: outlinedClasses('success'),
			text: textClasses('success'),
		},
		warning: {
			contained: containedClasses('warning'),
			outlined: outlinedClasses('warning'),
			text: textClasses('warning'),
		},
		danger: {
			contained: containedClasses('danger'),
			outlined: outlinedClasses('danger'),
			text: textClasses('danger'),
		},
		neutral: {
			contained: containedClasses('gray'),
			outlined: outlinedClasses('gray'),
			text: textClasses('gray'),
		},
	}

	const variantColorClasses = variants[color][variant]
	const sizeClasses = sizes[size]

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			style={style}
			type='button'
			className={clsx(...commanClasses, ...variantColorClasses, ...sizeClasses.button, className, '')}
		>

			{loading && <RiLoader5Line className={clsx(...variantColorClasses, ...sizeClasses.loading, 'absolute animate-spin shadow-none bg-transparent')} />}
			<span className={`${loading && 'invisible'}`}>{children || label}</span>
			{Icon && <Icon className={clsx(...sizeClasses.icon)} aria-hidden="true" />}
		</button>
	)
}
