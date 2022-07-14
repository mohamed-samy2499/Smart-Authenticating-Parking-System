import { Transition } from '@headlessui/react'
import { classNames } from 'utils'
import { GLoading } from '../g-loading'
import { GTransition } from '../g-transition'
import { GSectionProps } from './types'

export const GSection = ({ title, subtitle, actions, bar, children, loading, className }: GSectionProps) => {
	return (
		<div className="relative bg-white shadow rounded-md sm:rounded-lg mb-6">
			<div className={classNames('py-4 sm:py-5 lg:py-6 px-4 sm:px-5 lg:px-6', className || '')} >
				<div className="sm:flex items-start justify-between sm:space-x-2 md:space-x-6">
					{(title || subtitle) && <div className="mb-4 lg:mb-6">
						{title && <h1 className="text-lg mb-1 font-semibold text-gray-700">
							{title}
						</h1>}
						{subtitle && <span className="text-sm text-gray-400">
							{subtitle}
						</span>}
					</div>}
					{bar && <div className="space-x-2 flex-1 flex sm:justify-start md:justify-end">
						{bar}
					</div>}
					{actions && <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
						{actions}
					</div>}
				</div>
				<div className="" >
					{children}
				</div>
			</div>
			<Transition
				show={!!loading}
				enter="transition-opacity duration-150"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className='absolute top-0 bottom-0 left-0 right-0 bg-gray-500 opacity-30 z-100'><GLoading /></div>
			</Transition>
		</div>
	)
}