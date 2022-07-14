import { ReactComponent } from '*.svg'
import CSS from 'csstype'
import { ReactNode } from 'react'

export interface GbuttonProps {
	label?: string,
	children?: ReactNode,
	variant?: 'text' | 'contained' | 'outlined',
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral',
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
	disabled?: boolean,
	icon?: typeof ReactComponent,
	onClick?: () => void,
	style?: CSS.Properties,
	className?: string,
	loading?: boolean
}

