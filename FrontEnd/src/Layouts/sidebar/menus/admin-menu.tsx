
import {CgProfile } from 'react-icons/cg'
import {AiFillCar,AiFillControl } from 'react-icons/ai'
import {BsFillPeopleFill } from 'react-icons/bs'
import {FaPeopleArrows } from 'react-icons/fa'

import { NavItem } from '../nav-item'

export const AdminMenu = () => {
	return (
		<nav className="flex-1 px-2 divide-gray-300">
			<NavItem
				label='Profile'
				to={() => 'profile'}
				icon={CgProfile}
			/>
			<NavItem
				label='Cars'
				to={() => 'cars'}
				icon={AiFillCar}
			/>
			<NavItem
				label='Control'
				to={() => 'control'}
				icon={AiFillControl}
			/>
			<div>
				<p
					className="px-3 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
					id="communities-headline"
				>
					People
				</p>
				<NavItem
					label='Customers'
					to={() => 'customers'}
					icon={BsFillPeopleFill}
				/>
				<NavItem
					label='System Users'
					to={() => 'system-users'}
					icon={FaPeopleArrows}
				/>
			</div>
		</nav>
	)
}