/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { ModalTypes, GmodalProps } from './types'
import { classNames } from 'utils'

import { observer } from 'mobx-react'
import { useStores } from 'hooks/useStores'

const infoClasses = { icon: ['text-primary-500', 'bg-primary-100'], confirmButton: ['bg-primary-600', 'hover:bg-primary-700', 'focus:ring-primary-500'], cancelButton: ['focus:ring-primary-500'] }
const successClasses = { icon: ['text-success-500', 'bg-success-100'], confirmButton: ['bg-success-600', 'hover:bg-success-700', 'focus:ring-success-500'], cancelButton: ['focus:ring-success-500'] }
const warningClasses = { icon: ['text-warning-500', 'bg-warning-100'], confirmButton: ['bg-warning-600', 'hover:bg-warning-700', 'focus:ring-warning-500'], cancelButton: ['focus:ring-warning-500'] }
const dangerClasses = { icon: ['text-danger-500', 'bg-danger-100'], confirmButton: ['bg-danger-600', 'hover:bg-danger-700', 'focus:ring-danger-500'], cancelButton: ['focus:ring-danger-500'] }

interface typeClasses {
	icon: string[]
	confirmButton: string[]
	cancelButton: string[]
}
const MODAL_TYPE_CLASSES: Record<ModalTypes, typeClasses> = {
	info: infoClasses,
	success: successClasses,
	warning: warningClasses,
	danger: dangerClasses,
}


export const GModal = observer((props: GmodalProps) => {
	const { uiStore } = useStores()
	const { modalStatus, setModalState } = uiStore
	const {
		title,
		description,
		type = ModalTypes.INFO,
		showIcon = true,
		confirm,
		confirmLabel,
		cancel,
		body,
		customActions,
		confirmDisabled = false,
		actionsEnabled = true
	} = props

	const cancelButtonRef = useRef(null)
	const {
		iconClasses,
		confirmButtonClasses,
	} = classesSelector(type)

	return (
		<Transition.Root show={modalStatus} as={Fragment}>
			<Dialog as="div" className="fixed z-20 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModalState}>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
						<div className="inline-block align-bottom bg-white rounded-lg px-6 py-6 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:px-8">
							<div className="sm:flex sm:items-start">
								{showIcon && <div className={classNames('mx-auto mr-4 flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:h-10 sm:w-10', ...iconClasses)}>
									<ExclamationIcon className={classNames('h-6 w-6  aria-hidden="true')} />
								</div>}
								<div className="mt-0 text-center sm:text-left w-full">
									<Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
										{title}
									</Dialog.Title>
									{body || <div className="mt-2">
										<p className="text-sm text-gray-500">
											{description}
										</p>
									</div>}
								</div>
							</div>
							{actionsEnabled && <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse justify-between">
								<div>
									<button
										type="button"
										className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2  sm:mt-0 sm:w-auto sm:text-sm"
										onClick={() => cancelAction()}
										ref={cancelButtonRef}
									>
										Cancel
									</button>

									<button
										type="button"
										className={classNames('w-full inline-flex justify-center rounded-md border border-transparent shadow-sm ml-2 px-4 py-2  text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-50 disabled:text-gray-100', ...confirmButtonClasses)}
										onClick={() => confirmAction()}
										disabled={confirmDisabled}
									>
										{confirmLabel || 'Confirm'}
									</button>
								</div>
								{customActions && <div>{customActions}</div>}
							</div>}
						</div>
					</Transition.Child>
				</div>
			</Dialog >
		</Transition.Root >
	)


	function confirmAction() {
		if (confirm && typeof confirm === 'function') {
			confirm()
		}
	}
	function cancelAction() {
		if (typeof cancel === 'function') {
			cancel()
		}
		setModalState(false)
	}
})

function classesSelector(
	type: ModalTypes
) {
	const iconClasses: string[] = []
	const confirmButtonClasses: string[] = []
	const cancelButtonClasses: string[] = []
	iconClasses.push(...MODAL_TYPE_CLASSES[type].icon)
	confirmButtonClasses.push(...MODAL_TYPE_CLASSES[type].confirmButton)
	cancelButtonClasses.push(...MODAL_TYPE_CLASSES[type].cancelButton)

	return {
		iconClasses,
		confirmButtonClasses,
		cancelButtonClasses,
	}
}