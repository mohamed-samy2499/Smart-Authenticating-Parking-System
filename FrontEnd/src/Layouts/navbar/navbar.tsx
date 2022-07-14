// import {userNavigation} from './user-navigation-links'
import { observer } from 'mobx-react'
import { useStores } from '../../hooks/useStores'

import { Notifications } from './notifications'

import { RiBook3Line, RiMenu2Line, RiQuestionLine } from 'react-icons/ri'

import { AccountHeader } from './account-header'

import { useNavigate } from 'react-router-dom'
import { UserHeader } from './user-header'

export const Navbar = observer(() => {
	const navigate = useNavigate()
	const { uiStore } = useStores()
	const { setMobileSidebarOpen, mobileSidebarOpen, context } = uiStore

	return (
		<div className="sticky top-0 left-0 flex-shrink-0 flex h-16 bg-gray-800 shadow z-20">
			<div className='md:hidden flex justify-center items-center'>
				<button
					type="button"
					className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
					onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
				>
					<RiMenu2Line className="h-8 w-8" aria-hidden="true" />
				</button>
			</div>
			<div className="flex-1 flex justify-between mx-auto items-center">
				<div className="hidden md:flex">
					<AccountHeader />
				</div>
				<div className="flex flex-1 items-center space-x-2 justify-end">
					<Notifications />

					<div className='text-gray-200 cursor-pointer rounded-full hover:bg-primary-800 p-2'>
						<RiBook3Line className='h-4 w-4 text-gray-200' />
					</div>
					<div className='text-gray-200 cursor-pointer rounded-full hover:bg-primary-800 p-2'>
						<RiQuestionLine className='h-4 w-4 text-gray-200' />
					</div>
				</div>
				<div className='ml-4'>
					<UserHeader />
				</div>
			</div>
		</div>
	)
})