
// import { useStores } from 'hooks'
import { NavLink } from 'react-router-dom'
import { classNames } from 'utils'
import { MenuLinkProps } from './types'
export const MenuLink = (props: MenuLinkProps) => {
	const { to, icon, label, click, allowedUsers = [] } = props
	// const { userStore } = useStores()
	// const { user } = userStore
	// const admin = user?.admin

	// if (allowedUsers.includes(user ?) || allowedUsers.length === 0) {
	return (
		<div
			className='overflow-hidden'
			{...click && {
				...{ onClick: () => click() }
			}}>
			<NavLink
				to={to()}
				className={classNames('flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer space-x-3', props.className || '')}
			>
				{icon &&
					<props.icon className='text-gray-400 group-hover:text-gray-300 flex-shrink-0 h-4 w-4' />
				}
				<div className='text-gray-700'>{label}</div>
			</NavLink>
		</div>
	)
	// }
}