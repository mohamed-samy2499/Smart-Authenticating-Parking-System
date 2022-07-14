
import { classNames } from '../../../utils'
import { NavLink } from 'react-router-dom'


import { useAuth0 } from '@auth0/auth0-react'
import { RiArrowDownLine, RiArrowDownSLine, RiBankCardLine, RiBook3Line, RiBriefcaseLine, RiChatSmile2Line, RiHome6Line, RiListSettingsLine, RiLockPasswordLine, RiLogoutBoxRLine, RiProfileLine, RiShieldKeyholeFill, RiStackLine, RiUser3Line } from 'react-icons/ri'
import { MenuLink } from '../menu-link'
import { observer } from 'mobx-react'
import { Gdropdown } from 'components/basic-blocks'
import { useStores } from 'hooks/useStores'

export function UserHeaderDropdown() {
	return (
		<Gdropdown
			anchor='right'
			content={UserMenuContent}
			menuButton={<MenuButton />}
		/>
	)
}

const UserMenuContent = observer((props: any) => {
	const { close } = props
	const { authStore } = useStores()
	const { logout } = authStore
	return (
		<div className="origin-top-left absolute border right-2 mt-2 w-60 whitespace-nowrap text-ellipsis rounded-md shadow-lg bg-white ring-opacity-5 divide-y divide-gray-100 z-50">
			<div className='py-1'>
				<MenuLink
					label='Accounts'
					to={() => '/accounts'}
					icon={RiHome6Line}
					click={close}
				/>
				<MenuLink
					label='Profile'
					to={() => '/profile'}
					icon={RiUser3Line}
					click={close}
				/>
				<MenuLink
					label='Security'
					to={() => '/security'}
					icon={RiLockPasswordLine}
					click={close}
				/>
				<MenuLink
					label='Payment methods'
					to={() => '/payment-methods'}
					icon={RiBankCardLine}
					click={close}
				/>
			</div>
			<div className='py-1'>
				<a
					onClick={() => close()}
					className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiBook3Line className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-4 w-4' />
					Knowledge Base
				</a>
				<a
					onClick={() => close()}
					className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiChatSmile2Line className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-4 w-4' />
					Contact Support
				</a>
			</div>

		
			<div className='py-1'>
				<a
					onClick={() => logout()}
					className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiLogoutBoxRLine className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-4 w-4' />
					Logout
				</a>
			</div>
		</div>
	)
})

const MenuButton = observer(() => {
	const { authStore } = useStores()
	const { user } = authStore
	return (
		<div className="h-16 flex-shrink-0 flex max-w-full items-center">
			<div className="flex-shrink-0 w-full group block border-l border-l-gray-700 px-4">
				<div className="flex items-center">
					<div className='flex items-center space-x-4'>
						{/* <UserAvatar user={user} size={8} /> */}
						<div className="text-left flex-1 hidden md:block">
							<p className="text-sm font-medium text-gray-300 group-hover:text-gray-100">{user?.name}</p>
							<p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">{user?.email}</p>
						</div>
					</div>
					<div className='hidden md:block'>
						<RiArrowDownSLine className='text-gray-400 group-hover:text-gray-300 ml-2 flex-shrink-0 h-4 w-4' />
					</div>
				</div>
			</div>
		</div>
	)
})
