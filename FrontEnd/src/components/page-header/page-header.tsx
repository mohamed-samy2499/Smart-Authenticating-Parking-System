import { } from '@heroicons/react/solid'
import { Tabs } from '../tabs'
import { RiArrowRightSLine } from 'react-icons/ri'
import { classNames } from 'utils'
import { PageHeaderProps } from './types'
export const PageHeader = (props: PageHeaderProps) => {
	const { title, action, tags, subtitle, tabs, currentTab, tabsActions } = props
	return (
		<div className={classNames('flex flex-col mb-4 divide-y pt-4', 'bg-white border-b', '')}>
			<div className={classNames('flex justify-between items-center flex-1 min-w-0 pb-3', 'px-6', '')}>
				<div>
					<h2 className="text-xl font-semibold leading-10 text-primary-900 sm:text-2xl sm:truncate">
						{title}
					</h2>
					{tags && <div className='flex flex-wrap gap-x-2 font-normal'>
						{tags.map((item, i) => (
							<div key={`page-item-${i}`} className="flex items-center text-sm text-gray-500">
								{i > 0 && <RiArrowRightSLine className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />}
								{item.label && item.label}
							</div>
						))}
					</div>}
					{subtitle && <h5 className="flex items-center space-x-2 leading-7 text-sm text-gray-500 sm:truncate">
						{subtitle}
					</h5>}
				</div>
				{action && <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
					{action}
				</div>}
			</div>
			{(tabs && currentTab) || tabsActions ? <div className='flex px-6 items-center'>
				<div className='flex-1'>
					{tabs && currentTab && <Tabs current={currentTab} tabs={tabs} />}
				</div>
				{tabsActions && tabsActions}
			</div> : <></>}
		</div>
	)
}