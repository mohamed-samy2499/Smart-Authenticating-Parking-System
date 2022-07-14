import { NavLink } from 'react-router-dom'
import {  RiBankCardLine, RiBook3Line, RiBriefcaseLine, RiChatSmile2Line, RiCloseLine, RiListSettingsLine, RiLockPasswordLine, RiLogoutBoxRLine} from 'react-icons/ri'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { observer } from 'mobx-react'
import { useStores } from 'hooks/useStores'
import { UserAvatar } from 'components/user-avatar'

export const UserHeaderMobile = observer(() => {
	const { authStore, uiStore } = useStores()
	const { user } = authStore

	return (
		<div className="h-16 flex-shrink-0 flex bg-white max-w-full py-4">

			<a onClick={() => uiStore.setMobileUserMenuOpen(true)} className="flex-shrink-0 w-full group block border-l px-4">
				<div className='flex items-center space-x-4'>
					{/* <UserAvatar user={user} size={8} /> */}
				</div>
			</a>
			
			<Transition show={uiStore.mobileUserMenuOpen} as={Fragment}>
				<Dialog as="div" className="fixed inset-0 flex justify-end z-40 md:hidden border-b-2 border-b-primary-500" onClose={uiStore.setMobileUserMenuOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>
					<Transition.Child
						as={Fragment}
						enter="transition ease-in-out duration-300 transform"
						enterFrom="translate-x-full"
						enterTo="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leaveFrom="translate-x-0"
						leaveTo="translate-x-full"
					>
						<div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 overflow-y-auto bg-gray-100">
							<Transition.Child
								as={Fragment}
								enter="ease-in-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in-out duration-300"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div className="absolute top-0 left-0 -ml-12 pt-2">
									<button
										type="button"
										className="mr-1 flex items-center justify-center h-10 w-10 rounded-full"
										onClick={() => uiStore.setMobileUserMenuOpen(false)}
									>
										<RiCloseLine className="h-6 w-6 text-white" aria-hidden="true" />
									</button>
								</div>
							</Transition.Child>
							<div className='flex flex-col flex-1'>
								<UserHeader/>
								<div className='h-full'>
									{UserMenuContent()}
								</div>
							</div>
						</div>
					</Transition.Child>
					<div className="flex-shrink-0 w-0" aria-hidden="true">
						{/* Dummy element to force sidebar to shrink to fit close icon */}
					</div>
				</Dialog>
			</Transition>
		</div>

	)

	function UserHeader(){
		return(
			<div className="p-6 border-b">
				<div className="flex items-center justify-between">
					<div className='flex items-center space-x-4'>
						<UserAvatar user={user} size={12} />
						<div className="text-left flex-1">
							<p className="text-lg font-medium text-gray-500 group-hover:text-gray-700">{user?.name}</p>
							<p className="text-md font-medium text-gray-400 group-hover:text-gray-500">{user?.email}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
})





function UserMenuContent() {
	const { authStore } = useStores()
	const { user,logout } = authStore
	return (
		<div className="flex h-full flex-col text-ellipsis divide-y divide-gray-200">
			<div className='py-1'>
				<NavLink
					to='/user/subscriptions'
					className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiBriefcaseLine className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6' />
					<div className='text-gray-700'>Subscriptions</div>
				</NavLink>
				<NavLink
					to='/user/preferences'
					className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiListSettingsLine className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6' />
					<div className='text-gray-700'>Preferences</div>
				</NavLink>
				<NavLink
					to='/user/billing'
					className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiBankCardLine className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6' />
					<div className='text-gray-700'>Billing</div>
				</NavLink>
				<NavLink
					to='/user/security'
					className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiLockPasswordLine className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6' />
					<div className='text-gray-700'>Security</div>
				</NavLink>
			</div>
			<div className='py-1'>
				<a
					onClick={() => console.log('Knowledge base')}
					className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiBook3Line className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6' />
					Knowledge Base
				</a>
				<a
					onClick={() => console.log('Contact support')}
					className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiChatSmile2Line className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6' />
					Contact Support
				</a>
			</div>

			<div className='flex-1'></div>
			<div className='py-1'>
				<a
					onClick={() => logout()}
					className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
				>
					<RiLogoutBoxRLine className='text-gray-400 group-hover:text-gray-300 mr-3 flex-shrink-0 h-6 w-6' />
					Logout
				</a>
			</div>
		</div>
	)
}

