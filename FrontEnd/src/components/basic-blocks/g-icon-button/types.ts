import { ReactComponent } from '*.svg'
import CSS from 'csstype'

export interface GbuttonProps {
	icon?: typeof ReactComponent,
	variant?: 'text' | 'contained' | 'outlined',
	color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral',
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
	type?: 'circle' | 'square',
	onClick?: () => void,
	disabled?: boolean,
	style?: CSS.Properties,
	className?: string,
	children?: JSX.Element | Element | string
}