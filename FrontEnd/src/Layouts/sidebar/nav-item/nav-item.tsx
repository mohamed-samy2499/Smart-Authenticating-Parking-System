import { NavLink, useMatch } from 'react-router-dom'
import { classNames } from '../../../utils'
import { NavItemProps } from './types'
export const NavItem = (props: NavItemProps) => {
	const match = useMatch({
		path: props.to()
	})
	return (
		<NavLink
			to={props.to()}
			className={classNames(
				match ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
				props.nested ? 'pl-12' : 'font-medium',
				'group flex items-center px-3 py-2 text-sm rounded-md'
			)}
		>
			{props.icon && <props.icon
				className={classNames(
					match ? 'text-gray-500' : '',
					'mr-3 flex-shrink-0 h-6 w-6'
				)}
				aria-hidden="true"
			/>}
			{props.label}
		</NavLink>
	)
}