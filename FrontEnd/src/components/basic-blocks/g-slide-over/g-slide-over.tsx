/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { classNames } from 'utils'
import { RiCloseLine } from 'react-icons/ri'

export const GSlideOver = (props: any) => {
	const { children, content, open, setOpen, position = 'left', className, ...otherprops } = props
	return (
		<Transition show={open} as={Fragment}>
			<Dialog as="div" className={`fixed inset-0 flex justify-${position === 'left' ? 'start' : 'end'} z-40 md:hidden border-b-2 border-b-primary-500`} onClose={() => setOpen(false)}>
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
					enterFrom={position === 'left' ? '-translate-x-full' : 'translate-x-full'}
					enterTo='translate-x-0'
					leave="transition ease-in-out duration-300 transform"
					leaveFrom='translate-x-0'
					leaveTo={position === 'left' ? '-translate-x-full' : 'translate-x-full'}
				>
					<div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-100 overflow-y-auto overflow-x-hidden">
						{/* <Transition.Child
							as={Fragment}
							enter="ease-in-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in-out duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className={`absolute top-0 ${position === 'left' ? '-mr-12 right' : '-ml-12 left'}-0 pt-2`}>
								<button
									type="button"
									className="mx-1 flex items-center justify-center h-10 w-10 rounded-full"
									onClick={() => setOpen(false)}
								>
									<RiCloseLine className="h-6 w-6 text-white" aria-hidden="true" />
								</button>
							</div>
						</Transition.Child> */}
						<div className='flex flex-col flex-1'>
							<div className='h-full'>
								{children}
							</div>
						</div>
					</div>
				</Transition.Child>
				<div className="flex-shrink-0 w-0" aria-hidden="true">
					{/* Dummy element to force sidebar to shrink to fit close icon */}
				</div>
			</Dialog>
		</Transition>
	)
}
