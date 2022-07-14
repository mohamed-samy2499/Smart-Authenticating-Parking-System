import { useEffect } from 'react'
import { RiAlarmWarningLine } from 'react-icons/ri'
import { NavLink, useSearchParams } from 'react-router-dom'
import { classNames } from 'utils'
import { TabItem, TabsProps } from './types'

export function Tabs(props: TabsProps) {
	const { current, tabs, actions } = props

	return (
		<div className='pt-3'>
			<div className="sm:hidden">
				<select
					id="tabs"
					name="tabs"
					className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
					defaultValue={tabs.find((tab: TabItem) => tab.key === current)?.label || undefined}
				>
					{tabs.map((tab: any) => (
						<option key={tab.key}>{tab.name}</option>
					))}
				</select>
			</div>
			<div className="hidden sm:block">
				<div className="flex items-center space-x-6">
					<nav className="flex-1 -mb-px flex space-x-6" aria-label="Tabs">
						{tabs.map((tab: TabItem) => (
							<NavLink
								key={tab.key}
								to={tab.to()}
								className={classNames(
									tab.key === current ? 'border-b-primary-500 border-b-2 text-gray-500' : 'hover:text-gray-500 text-gray-400',
									'pb-3 font-medium text-sm'
								)}
								aria-current={tab.key === current ? 'page' : undefined}
							>
								<span>{tab.label}</span>
								{tab.notification && (
									<span
										className={classNames(
											`hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block bg-${tab.notification.color}-100 text-${tab.notification.color}-500`
										)}
									>
										{tab.notification.count || <RiAlarmWarningLine />}
									</span>
								)}
							</NavLink>
						))}
						<div className='flex-1'></div>
					</nav>
					<div className='self-end'>
						{actions}
					</div>
				</div>
			</div>
		</div>
	)
}