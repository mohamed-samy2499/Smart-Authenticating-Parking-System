/* This example requires Tailwind CSS v2.0+ */
import clsx from 'clsx'
import { FC } from 'react'
import { PlusSmIcon as PlusSmIconSolid } from '@heroicons/react/solid'
import { GbuttonProps } from './types'
import { RiAddLine } from 'react-icons/ri'
import { GTooltip } from '../g-tooltip'

//CLASSES FOR TAILWIND
const commanClasses = ['inline-flex', 'items-center', 'border', 'shadow-sm', 'focus: outline-none']

const xsmallSizeClasses = { icon: ['h-4 w-4'], button: ['p-1'] }
const smallSizeClasses = { icon: ['h-5 w-5'], button: ['p-1.5'] }
const mediumSizeClasses = { icon: ['h-5 w-5'], button: ['p-2'] }
const largeSizeClasses = { icon: ['h-6 w-6'], button: ['p-2'] }
const xlargeSizeClasses = { icon: ['h-6 w-6'], button: ['p-3'] }

const outlinedClasses = (color: string) => {
	return [`border-${color}-500 bg-transparent text-${color}-500 hover:bg-${color}-400 focus:ring-${color}-500 disabled:bg-transparent disabled:text-${color}-200 disabled:border-${color}-200`]
}

const containedClasses = (color: string) => {
	return [`border-transparent bg-${color}-500 text-white hover:bg-${color}-400 focus:ring-${color}-500 disabled:bg-${color}-300 disabled:text-gray-50`]
}

const textClasses = (color: string) => {
	return [`border-transparent shadow-none bg-white text-${color}-500 hover:bg-gray-50 focus:ring-${color}-500 disabled:bg-transparent disabled:text-${color}-200`]
}

export const GIconButton: FC<GbuttonProps> = (props) => {
	const {
		variant = 'contained',
		color = 'neutral',
		size = 'md',
		disabled = false,
		type = 'circle',
		icon: Icon = RiAddLine,
		onClick,
		style = {},
		className,
		children
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
		}
	}

	const variantColorClasses = variants[color][variant]
	const sizeClasses = sizes[size]
	return (
		<>
			<button
				style={style}
				type="button"
				disabled={disabled}
				className={clsx(...commanClasses, ...variantColorClasses, ...sizeClasses.button, className, `${type === 'circle' && 'rounded-full'}`)}
				onClick={onClick}
			>
				{children ? (
					<GTooltip
						content={<span className='text-gray-700'>{children}</span>}
					>
						{Icon && <Icon className={clsx(...sizeClasses.icon)} aria-hidden="true" />}
					</GTooltip>
				) : (
					<Icon className={clsx(...sizeClasses.icon)} aria-hidden="true" />
				)}
			</button>
		</>
	)
}
