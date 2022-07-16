/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { ModalTypes, GDialogProps } from './types'
import { classNames } from 'utils'
import { RiCloseLine } from 'react-icons/ri'
import { GIconButton } from '../g-icon-button'

export function GDialog(props: GDialogProps) {
	const {
		title,
		subtitle,
		description,
		icon,
		children,
		open = false,
		onClose,
		className,
		showClose = true,
		maxWidth='lg'
	} = props

	const Icon = icon

	const maxW = {
		'md': 'max-w-md',
		'lg': 'max-w-lg',
		'xl': 'max-w-xl',
		'2xl': 'max-w-2xl',
		'3xl': 'max-w-3xl',
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="fixed z-20 inset-0 overflow-y-auto" onClose={onClose}>
				<div className="relative flex items-end justify-center min-h-screen p-4 px-4 text-center sm:block">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className={classNames(`inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:${maxW[maxWidth]} sm:w-full p-6`, className || '')} >
							<div className="sm:flex sm:items-start">
								{icon && <div className={classNames('mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10')}>
									<Icon className={classNames('h-6 w-6 text-gray-700')} />
								</div>}
								<div className="text-left w-full">
									<Dialog.Title as="h3" className="text-xl leading-6 font-semibold text-gray-900 mb-2">
										{title}
									</Dialog.Title>
									<Dialog.Title as="h6" className="text-sm text-gray-700">
										{subtitle}
									</Dialog.Title>
									
									{children || <div className="mt-2">
										<p className="text-sm text-gray-500">
											{description}
										</p>
									</div>}
								</div>
							</div>
							{showClose && <div className='absolute top-6 right-6'>
								<GIconButton icon={RiCloseLine} size="sm" color='neutral' onClick={onClose}>Close</GIconButton>
							</div>}
						</div>
					</Transition.Child>
				</div>
			</Dialog >
		</Transition.Root >
	)
}